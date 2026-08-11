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

const bridgeStats = {
  startedAt: Date.now(),
  published: 0,
  publishErrors: 0,
  lastPublishAt: 0,
  latenciesMs: /** @type {number[]} */ ([]),
  wsFanoutFails: 0,
};

function recordLatency(ms) {
  bridgeStats.latenciesMs.push(ms);
  if (bridgeStats.latenciesMs.length > 600) {
    bridgeStats.latenciesMs.splice(0, bridgeStats.latenciesMs.length - 600);
  }
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * p))];
}

publisher.subscribe((frame) => {
  const line = encodeLiveLinkLine(frame);
  for (const ws of clients) {
    if (ws.readyState === 1) {
      try {
        ws.send(line);
      } catch {
        bridgeStats.wsFanoutFails += 1;
      }
    }
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
    res.end(
      JSON.stringify({
        ok: true,
        clients: clients.size,
        frame: publisher.frameIndex,
        published: bridgeStats.published,
      }),
    );
    return;
  }

  if (req.method === 'GET' && req.url === '/stats') {
    const uptimeSec = (Date.now() - bridgeStats.startedAt) / 1000;
    const fps =
      uptimeSec > 0.05 ? bridgeStats.published / uptimeSec : 0;
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        clients: clients.size,
        frameIndex: publisher.frameIndex,
        published: bridgeStats.published,
        publishErrors: bridgeStats.publishErrors,
        wsFanoutFails: bridgeStats.wsFanoutFails,
        uptimeSec: Number(uptimeSec.toFixed(2)),
        avgFps: Number(fps.toFixed(2)),
        lastPublishAt: bridgeStats.lastPublishAt || null,
        p50LatencyMs: Number(percentile(bridgeStats.latenciesMs, 0.5).toFixed(2)),
        p95LatencyMs: Number(percentile(bridgeStats.latenciesMs, 0.95).toFixed(2)),
      }),
    );
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
    const t0 = Date.now();
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      const frame = body.blendShapes
        ? buildLiveLinkFrame(body.blendShapes, { subject: body.subject })
        : morphsToLiveLinkFrame(body.weights || body.morphs || {}, { subject: body.subject });
      publisher.publishArkit(frame.blendShapes);
      bridgeStats.published += 1;
      bridgeStats.lastPublishAt = Date.now();
      recordLatency(Date.now() - t0);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, frame: publisher.frameIndex }));
    } catch (err) {
      bridgeStats.publishErrors += 1;
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
