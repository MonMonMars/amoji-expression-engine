/**
 * Authenticated TTS smoke — hit real endpoint when configured, else local echo server.
 * Validates Bearer token wiring end-to-end without committing secrets.
 */
import http from 'node:http';
import { applyComplianceGate } from '../compliance/complianceGate.js';
import { resolveTtsConfig, createTtsProviderFromConfig } from './ttsConfig.js';
import { playWithProvider } from './ttsProvider.js';
import { SpeechPlayer } from './speechPlayer.js';
import fixtures from '../../data/tts/fixtures/sample-payloads.json' with { type: 'json' };

/**
 * Start a one-shot local TTS echo that requires Bearer auth.
 * @param {{ token?: string, port?: number }} [opts]
 * @returns {Promise<{ url: string, close: () => Promise<void>, token: string }>}
 */
export function startAuthEchoServer(opts = {}) {
  const token = opts.token || 'amoji-smoke-token';
  const port = opts.port ?? 0;

  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }
      if (req.method !== 'POST' || req.url !== '/synthesize') {
        res.writeHead(404);
        res.end('not found');
        return;
      }
      const auth = req.headers.authorization || '';
      if (auth !== `Bearer ${token}`) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'unauthorized' }));
        return;
      }
      const chunks = [];
      for await (const c of req) chunks.push(c);
      let body = {};
      try {
        body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
      } catch {
        body = {};
      }
      const text = body.text || fixtures.stepAudioEditX.text;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          ...fixtures.stepAudioEditX,
          provider: body.provider || 'smoke-echo',
          text,
          audioUrl: '/data/tts/fixtures/hello-mama.wav',
        }),
      );
    });

    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const addr = server.address();
      const p = typeof addr === 'object' && addr ? addr.port : port;
      resolve({
        url: `http://127.0.0.1:${p}/synthesize`,
        token,
        close: () =>
          new Promise((res, rej) => {
            server.close((err) => (err ? rej(err) : res()));
          }),
      });
    });
  });
}

/**
 * Run authenticated TTS smoke.
 * - If AMOJI_TTS_ENDPOINT (+ optional token) set → hit real service
 * - Else spin local auth echo and validate Bearer round-trip
 *
 * @param {{
 *   env?: Record<string, string|undefined>,
 *   text?: string,
 *   emotion?: string,
 *   useLocalEcho?: boolean,
 *   fetchImpl?: typeof fetch,
 * }} [opts]
 */
export async function runAuthenticatedTtsSmoke(opts = {}) {
  const env = opts.env || (typeof process !== 'undefined' ? process.env : {});
  const cfg = resolveTtsConfig({ env, browser: null });
  const text = opts.text || 'Hello mama.';
  const emotion = opts.emotion || 'happy';

  let echo = null;
  let providerCfg = cfg;
  let mode = 'remote';

  const forceLocal = opts.useLocalEcho === true || !cfg.readyForHttp;

  try {
    if (forceLocal) {
      mode = 'local_echo';
      echo = await startAuthEchoServer({
        token: env.AMOJI_TTS_TOKEN || 'amoji-smoke-token',
      });
      providerCfg = resolveTtsConfig({
        env: {
          AMOJI_TTS_ENDPOINT: echo.url,
          AMOJI_TTS_TOKEN: echo.token,
          AMOJI_TTS_PROVIDER: 'smoke-echo',
          AMOJI_TTS_TYPE: 'http',
        },
        browser: null,
      });
    }

    if (!providerCfg.readyForHttp) {
      return applyComplianceGate(
        {
          kind: 'tts_smoke',
          ok: false,
          mode,
          error: 'no_endpoint',
          hint: 'Set AMOJI_TTS_ENDPOINT (+ AMOJI_TTS_TOKEN) or use local echo',
        },
        {},
      );
    }

    const provider = createTtsProviderFromConfig(providerCfg, {
      fetchImpl: opts.fetchImpl,
    });
    const syn = await provider.synthesize({ text, emotion });
    if (syn.error) {
      return applyComplianceGate(
        {
          kind: 'tts_smoke',
          ok: false,
          mode,
          error: syn.error,
          status: syn.status,
          endpoint: providerCfg.endpoint,
          hasToken: providerCfg.hasToken,
        },
        {},
      );
    }

    const player = new SpeechPlayer({ emotion, intensity: 0.8 });
    const played = await playWithProvider(player, provider, { text, emotion }, {
      demoToneFallback: false,
    });

    return applyComplianceGate(
      {
        kind: 'tts_smoke',
        ok: !!played.ok && !syn.error,
        mode,
        endpoint: providerCfg.endpoint,
        hasToken: providerCfg.hasToken,
        provider: syn.provider || played.provider,
        audioUrl: syn.audioUrl || played.audioUrl,
        phonemeCount: syn.normalized?.phonemes?.length ?? 0,
        syncMode: played.syncMode,
        duration: played.duration,
        authRequired: mode === 'local_echo' || providerCfg.hasToken,
      },
      {},
    );
  } finally {
    if (echo) await echo.close().catch(() => {});
  }
}
