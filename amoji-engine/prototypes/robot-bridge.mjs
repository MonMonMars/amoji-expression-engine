/**
 * WebSocket / HTTP relay for Amoji robot vendor + human-face payloads.
 *
 *   cd amoji-engine
 *   npm run robot-bridge
 *   # WS   ws://127.0.0.1:7880
 *   # HTTP http://127.0.0.1:7881/publish
 *
 * Face Live posts `amoji.robotVendor.v1` frames; companions subscribe and
 * optionally forward to Furhat / QTrobot / Unitree.
 */
import http from 'node:http';
import { WebSocketServer } from 'ws';

const WS_PORT = Number(process.env.ROBOT_BRIDGE_PORT || 7880);
const HTTP_PORT = Number(process.env.ROBOT_BRIDGE_HTTP_PORT || WS_PORT + 1);

/** @type {Set<import('ws').WebSocket>} */
const clients = new Set();
/** @type {object | null} */
let lastPayload = null;
const stats = {
  startedAt: Date.now(),
  published: 0,
  publishErrors: 0,
  fanoutFails: 0,
};

function broadcast(obj) {
  const line = JSON.stringify(obj);
  for (const ws of clients) {
    if (ws.readyState === 1) {
      try {
        ws.send(line);
      } catch {
        stats.fanoutFails += 1;
      }
    }
  }
}

function acceptPublish(body) {
  if (!body || typeof body !== 'object') throw new Error('expected JSON object');
  const envelope = {
    type: 'robotVendor',
    protocol: 'amoji.robotVendor.v1',
    receivedAt: Date.now(),
    payload: body.schema ? body : body.payload || body,
  };
  lastPayload = envelope;
  stats.published += 1;
  broadcast(envelope);
  return envelope;
}

const wss = new WebSocketServer({ port: WS_PORT });
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(
    JSON.stringify({
      type: 'hello',
      protocol: 'amoji.robotBridge.v1',
      ws: `ws://127.0.0.1:${WS_PORT}`,
      http: `http://127.0.0.1:${HTTP_PORT}/publish`,
    }),
  );
  if (lastPayload) ws.send(JSON.stringify(lastPayload));

  ws.on('message', (buf) => {
    try {
      const msg = JSON.parse(String(buf));
      if (msg.type === 'publish' || msg.schema === 'amoji.robotVendor.v1') {
        acceptPublish(msg.payload || msg);
      } else if (msg.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', t: Date.now() }));
      }
    } catch {
      stats.publishErrors += 1;
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

  if (req.method === 'GET' && (req.url === '/' || req.url === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        clients: clients.size,
        published: stats.published,
        publishErrors: stats.publishErrors,
        fanoutFails: stats.fanoutFails,
        uptimeSec: Number(((Date.now() - stats.startedAt) / 1000).toFixed(1)),
        lastVendor: lastPayload?.payload?.vendor?.id || null,
      }),
    );
    return;
  }

  if (req.method === 'GET' && req.url === '/last') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(lastPayload || {}));
    return;
  }

  if (req.method === 'POST' && req.url === '/publish') {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      const env = acceptPublish(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, vendor: env.payload?.vendor?.id }));
    } catch (err) {
      stats.publishErrors += 1;
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: String(err) }));
    }
    return;
  }

  res.writeHead(404);
  res.end('not found');
});

server.listen(HTTP_PORT, '127.0.0.1', () => {
  console.log(`[robot-bridge] WS   ws://127.0.0.1:${WS_PORT}`);
  console.log(`[robot-bridge] HTTP http://127.0.0.1:${HTTP_PORT}/publish`);
});
