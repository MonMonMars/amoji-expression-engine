# Amoji realtime 3D stack — Blender + Unreal (local Mac)

## What this Cloud Agent could / could not install

| Software | Cloud VM status | Your Mac (required for full pipeline) |
|---|---|---|
| Blender 4.0 + MB-Lab | ✅ Installed & used | Install Blender 4.2+ LTS |
| BlenderMCP (`blender-mcp`) | ✅ Server venv + old addon.py | Fresh addon from blendermcp.org |
| Unreal Engine 5.x | ❌ No GPU, no Epic login, ~80–150GB | Install via Epic Games Launcher |
| Unreal MCP plugins | ✅ Sources downloaded under `/agent/tools/` | Copy into UE project |
| MetaHuman | ❌ Needs Epic account + UE | Optional for hyper-real faces |

**This machine has `DISPLAY=:1` but no NVIDIA GPU.** Unreal Play-in-Editor / MetaHuman realtime is not viable here. Use your desktop for UE.

---

## Character identity (important)

Demo avatar name: **Amoji Sakura**  
Mood reference only: soft East-Asian beauty / long dark hair / seifuku (aesthetic adjacent to actresses like 今田美櫻).  
**Not** a photoreal celebrity likeness, deepfake, or licensed use of Imada Mio’s identity.

Variants:
- `AmojiSakura_stylized` — anime MB-Lab (`f_an01`) — uncanny-safe
- `AmojiSakura_realistic` — Asian female MB-Lab (`f_as01`) — higher realism base (still not MetaHuman)

Both include long dark particle hair + sailor school uniform + white underlayer meshes.

---

## BlenderMCP (Cursor)

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["--python", "3.11", "blender-mcp"],
      "env": {
        "DISABLE_TELEMETRY": "true",
        "BLENDER_HOST": "localhost",
        "BLENDER_PORT": "9876"
      }
    }
  }
}
```

1. Blender → install latest `addon.py` → enable **Blender MCP** → N-panel → Connect  
2. Restart Cursor  

---

## Unreal Engine MCP (pick one)

Sources already fetched:
- `tools/unreal-engine-mcp-main` (harn3ss — UE 5.7 Remote Control + Python bridge)
- `tools/unreal-mcp-main` (RonildoBraga — UE 5.7 C++ plugin + Python server)
- `tools/ue5-mcp-bridge-master` (Natfii bridge)

### Recommended path for Amoji facial testing

1. Install **UE 5.7+** (or **5.8** for Epic’s built-in MCP plugin)  
2. Create project `AmojiRealtime`  
3. Enable plugins: **Python Editor Script Plugin**, **Remote Control API** (and Epic **Model Context Protocol** on 5.8)  
4. Import `AmojiSakura_realistic.glb` (or FBX from Blender)  
5. For hyper-real faces: MetaHuman + Live Link / ARKit 52 curve drive from Amoji engine  
6. Wire MCP — example for harn3ss style:

```json
{
  "mcpServers": {
    "unreal": {
      "command": "uvx",
      "args": ["unreal-mcp"],
      "env": {
        "UE_PROJECT_PATH": "/absolute/path/AmojiRealtime/AmojiRealtime.uproject",
        "UE_ENGINE_PATH": "/absolute/path/UE_5.7"
      }
    }
  }
}
```

On UE 5.8: enable built-in **Unreal MCP** plugin → Project Settings → MCP → Auto Start → generate Claude/Cursor client config from editor console.

---

## Suggested realtime test loop (desktop)

1. `npm run livelink` + Face Live **Live Link pub** (or POST `/publish`)  
2. UE: run `unreal/AmojiLiveLinkConsumer.py` against actor `AmojiSakura`  
3. PIE: play “mama papa” + Happy t=1.0 — verify MBP jaw lock visually  
4. Compare stylized vs realistic side-by-side for uncanny check  

See **`UNREAL_LIVELINK.md`** for the ARKit frame protocol.

---

## Legal / product notes

- MB-Lab = **AGPL-3** — commercial shipping of derived meshes needs legal review  
- Celebrity likeness / right of publicity — do not market “Imada Mio” as the avatar  
- School uniform is an adult costume look for the demo character  
