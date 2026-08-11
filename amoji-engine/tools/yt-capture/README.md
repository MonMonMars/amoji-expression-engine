# YouTube / video expression capture (authoring)

Pull performance timing from YouTube or local video → face-quality gate → ARKit NDJSON → `capture-bake`.

**Not runtime.** Bake abstract curves only. Respect YouTube ToS / copyright. No celebrity likeness in product.

## Flow

```
YouTube URL or local.mp4
        │
        ▼
 npm run yt-capture          (yt-dlp + ffmpeg trim)
        │
        ▼
 tools/yt-capture/out/*.mp4 + *.job.json
        │
        ▼
 npm run yt-capture-batch    (MediaPipe + quality gates in browser)
        │
        ▼
 NDJSON → npm run capture-bake -- --apply-temporal
```

## Prep clip

```bash
cd amoji-engine

# Local file
npm run yt-capture -- --in ./talk.mp4 --emotion happy --start 12 --duration 6

# YouTube (requires yt-dlp on PATH)
npm run yt-capture -- --url 'https://www.youtube.com/watch?v=VIDEO_ID' --emotion sad --start 30 --duration 5
```

## Track + filter

```bash
npm run yt-capture-batch
# http://127.0.0.1:5176/prototypes/yt-capture-batch.html
# Load clip or click "Try latest prep"
```

Gates drop: tiny faces, strong profile, edge crops, low quality scores.

## Bake

```bash
npm run capture-bake -- --emotion happy --in ./happy-yt.ndjson --apply-temporal
```

## Code

| Path | Role |
|---|---|
| `engine/capture/videoIngest.js` | Face quality score + frame filter + take builder |
| `tools/yt-capture/cli.mjs` | Download / trim / job manifest |
| `prototypes/yt-capture-batch.html` | MediaPipe batch UI |

## Clip tips

- Close-up talking head, front-ish, good light  
- 3–10s single emotion beat  
- Avoid rapid cuts, multi-person, heavy profile  
