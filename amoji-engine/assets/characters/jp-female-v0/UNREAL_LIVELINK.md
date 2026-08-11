# Amoji → Unreal Live Link (ARKit 52)

Cloud agents cannot run Unreal (no GPU / Epic). On your **Mac**:

## 1. Start the Amoji bridge

```bash
cd amoji-engine
npm run livelink
# WS  ws://127.0.0.1:7878
# HTTP http://127.0.0.1:7879/publish  + /last + /health + /stats
```

## 2. Drive from Face Live (or soak CLI)

```bash
npm run face-live
# open Face Live → enable **Live Link pub**
```

Face Live POSTs ARKit frames (compliance-gated) to `/publish`.

Synthetic soak (no Face Live UI):

```bash
# Terminal A: npm run livelink
# Terminal B:
npm run livelink:soak -- --duration 10 --fps 30
# or memory-only (no bridge):
npm run livelink:soak -- --memory --duration 2 --fps 60
```

## 3. Consume in Unreal

1. Import Sakura with ARKit-named morphs (or MetaHuman Live Link Face map)
2. Label the actor `AmojiSakura`
3. Run `unreal/AmojiLiveLinkConsumer.py` in the UE Python console:

```python
import importlib.util
spec = importlib.util.spec_from_file_location(
    "amoji_ll",
    r"/ABS/PATH/amoji-engine/assets/characters/jp-female-v0/unreal/AmojiLiveLinkConsumer.py",
)
mod = importlib.util.module_from_spec(spec); spec.loader.exec_module(mod)
mod.start_polling(actor_label="AmojiSakura", http_url="http://127.0.0.1:7879/last", hz=30)
```

Dry-run outside UE (bridge must be publishing):

```bash
python3 assets/characters/jp-female-v0/unreal/AmojiLiveLinkConsumer.py --soak 5
```

## Mac soak checklist (UE side)

Use this after bridge + soak (or Face Live pub) are running:

| Step | Check | Pass criteria |
|---|---|---|
| Bridge health | `curl -s http://127.0.0.1:7879/health` | `ok: true`, `frame` climbing |
| Bridge stats | `curl -s http://127.0.0.1:7879/stats` | `published` ↑, `p95LatencyMs` reasonable for LAN |
| Last frame | `curl -s http://127.0.0.1:7879/last \| jq '.blendShapes.jawOpen'` | Non-null number while soaking |
| Consumer dry-run | `python3 …/AmojiLiveLinkConsumer.py --soak 5` | `framesSeen ≥ expected`, few errors |
| UE morph apply | Actor label `AmojiSakura`, ARKit morph names | Jaw/smile visibly move; console `[amoji-livelink]` quiet |
| Drop soak | Stop soak; `/stats` `avgFps` settles | No stuck morphs after last frame |

Suggested soak load:

```bash
npm run livelink:soak -- --duration 30 --fps 30
# Watch /stats in another terminal:
watch -n1 'curl -s http://127.0.0.1:7879/stats'
```

Pass bar (LAN, same machine): drop rate &lt; 5%, consumer `errors == 0`, jawOpen tracks smile cycle.

## Frame schema

```json
{
  "protocol": "amoji.livelink.arkit.v1",
  "subject": "AmojiSakura",
  "frame": 12,
  "fps": 60,
  "blendShapes": { "jawOpen": 0.4, "mouthSmileLeft": 0.8, "...": 0 },
  "meta": { "compliance": "passed" }
}
```

52 channels match Apple ARKit / Live Link Face names (`data/arkit/arkit-mapping.json`).

## Optional: Control Rig remap

ARKit channel names may not match your UE morph / Control Rig controls. Sample profiles live in:

- `data/ue/control-rig-arkit-remap.json` — `identity` · `sakura-expression` · `metahuman-ctrlrig-sample`
- `engine/export/controlRigRemap.js` — `remapArkitToMorphs` / `remapLiveLinkFrame`

```js
import { remapLiveLinkFrame } from './engine/export/controlRigRemap.js';
const ueFrame = remapLiveLinkFrame(arkitFrame, { profileId: 'sakura-expression' });
// ueFrame.morphs['Expressions_jawOpen_max'] …
```

In the UE consumer, either rename morph targets to ARKit names, or apply the sample map before `set_morph_target`.

## Optional: Epic Live Link Face plugin

If you prefer the stock UDP Live Link Face source, write a tiny converter that maps this JSON into the plugin’s subject — same channel names.

## Consumer helpers

| Function | Role |
|---|---|
| `start_polling` / `stop_polling` | Background `/last` → morph targets |
| `fetch_stats` | Read bridge `/stats` |
| `soak_report(seconds, hz)` | Count frames / errors for Mac validation |
| `python3 …Consumer.py --soak N` | CLI dry-run soak |
