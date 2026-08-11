/**
 * WebSocket Live Link bridge — publishes Amoji ARKit frames for Unreal.
 *
 *   cd amoji-engine
 *   node prototypes/livelink-bridge.mjs
 *   # ws://127.0.0.1:7878
 *
 * POST JSON ARKit or morph weights to /publish (HTTP on same port +1),
 * or send WS messages: { "type":"arkit", "blendShapes":{...} }
 */
import http from 'node:http';
import { WebSocketServer } from 'ws';
import {
  buildLiveLinkFrame,
  morphsToLiveLinkFrame,
  encodeLiveLinkLine,
  LiveLinkPublisher,
} from '../engine/export/liveLinkFace.js';

const WS_PORT = Number(process.env.LIVELINK_PORT || 7878);
const HTTP_PORT = Number(process.env.LIVELINK_HTTP_PORT || WS_PORT + 1);

const publisher = new LiveLinkPublisher({ subject: 'AmojiSakura', fps: 60 });
/** @type {Set<import('ws').WebSocket>} */
const clients = new Set();

publisher.subscribe((frame) => {
  const line = encodeLiveLinkLine(frame);
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(line);
  }
});

const wss = new WebSocketServer({ port: WS_PORT });
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(
    JSON.stringify({
      type: 'hello',
      protocol: 'amoji.livelink.arkit.v1',
      subject: 'AmojiSakura',
    }) + '\n',
  );
  if (publisher.lastFrame) ws.send(encodeLiveLinkLine(publisher.lastFrame));

  ws.on('message', (buf) => {
    try {
      const msg = JSON.parse(String(buf));
      if (msg.type === 'arkit' && msg.blendShapes) {
        publisher.publishArkit(msg.blendShapes);
      } else if (msg.type === 'morphs' && msg.weights) {
        publisher.publishMorphs(msg.weights);
      } else if (msg.blendShapes) {
        publisher.publishArkit(msg.blendShapes);
      }
    } catch {
      /* ignore */
    }
  });
  ws.on('close', () => clients.delete(ws));
});

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, clients: clients.size, frame: publisher.frameIndex }));
    return;
  }

  if (req.method === 'GET' && req.url === '/last') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(publisher.lastFrame || {}));
    return;
  }

  if (req.method === 'POST' && req.url === '/publish') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      const frame = body.blendShapes
        ? buildLiveLinkFrame(body.blendShapes, { subject: body.subject })
        : morphsToLiveLinkFrame(body.weights || body.morphs || {}, { subject: body.subject });
      publisher.publishArkit(frame.blendShapes);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, frame: publisher.frameIndex }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: String(err) }));
    }
    return;
  }

  res.writeHead(404);
  res.end('not found');
});

server.listen(HTTP_PORT, '127.0.0.1', () => {
  console.log(`[livelink] WS  ws://127.0.0.1:${WS_PORT}`);
  console.log(`[livelink] HTTP http://127.0.0.1:${HTTP_PORT}/publish`);
});
