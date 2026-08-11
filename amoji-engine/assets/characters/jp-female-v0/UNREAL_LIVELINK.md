# Amoji → Unreal Live Link (ARKit 52)

Cloud agents cannot run Unreal (no GPU / Epic). On your Mac:

## 1. Start the Amoji bridge

```bash
cd amoji-engine
npm run livelink
# WS  ws://127.0.0.1:7878
# HTTP http://127.0.0.1:7879/publish  + /last + /health
```

## 2. Drive from Face Live

```bash
npm run face-live
# open Face Live → enable **Live Link pub**
```

Face Live POSTs ARKit frames (compliance-gated) to `/publish`.

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

## Optional: Epic Live Link Face plugin

If you prefer the stock UDP Live Link Face source, write a tiny converter that maps this JSON into the plugin’s subject — same channel names.
