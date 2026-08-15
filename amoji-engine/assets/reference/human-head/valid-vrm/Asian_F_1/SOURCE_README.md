# VALID VRM Avatars

Clean VRM 1.0 conversions of Google's [VALID](https://github.com/google-research/google-research/tree/master/valid) (Visually Aligned Inclusive Dataset) avatars, extended with full **ARKit 52 blend shape** support for facial animation.

## What's here

Each avatar is a self-contained `.vrm` file ready to load in any VRM 1.0-compatible runtime (Babylon.js, three-vrm, UniVRM, etc.).

### Demographics

| Folder | Group |
|--------|-------|
| `AIAN/` | American Indian / Alaska Native |
| `Asian/` | Asian |
| `Black/` | Black |
| `Hispanic/` | Hispanic |
| `MENA/` | Middle Eastern / North African |
| `NHPI/` | Native Hawaiian / Pacific Islander |
| `White/` | White |
| `X_Non-validated/` | Non-validated / mixed |

### Naming convention

```
{Ethnicity}_{Sex}_{BodyType}_{Outfit}.vrm

Examples:
  Black_F_1_Casual.vrm    — Black female, body type 1, casual outfit
  Hispanic_M_2_Milit.vrm  — Hispanic male, body type 2, military outfit
```

Outfit codes: `Busi` Business · `Casual` Casual · `Default` Default · `Medi` Medical · `Milit` Military · `Util` Utility

### ARKit 52 blend shapes

All models include the full ARKit 52 facial blend shape set on the `H_DDS_HighRes` mesh, enabling:

- Real-time facial animation from ARKit face tracking
- Audio-driven lip sync via tools like [LAM-Audio2Expression](https://github.com/KurisuMakise004/LAM_Audio2Expression)
- Compatible with the VRMC_vrm_animation expression pipeline

The `cleanFace.md` file documents the Blender cleanup process used to add and wire these shapes.

## Usage

### Babylon.js

```js
import { ImportMeshAsync } from "@babylonjs/core";
await ImportMeshAsync("Black_F_1_Casual.vrm", scene);
```

Requires [babylon-vrm-loader](https://github.com/virtual-cast/babylon-vrm-loader) and a VRM 1.0 extension (see [TLTMedia/VRET](https://github.com/TLTMedia/VRET)).

### three.js / three-vrm

```js
const loader = new GLTFLoader();
loader.register(parser => new VRMLoaderPlugin(parser));
const gltf = await loader.loadAsync("Black_F_1_Casual.vrm");
const vrm = gltf.userData.vrm;
```

## Attribution

Original 3D avatars from **Google VALID** — [google-research/google-research](https://github.com/google-research/google-research/tree/master/valid).  
VRM conversion and ARKit blend shape integration by [TLTMedia](https://github.com/TLTMedia).

Google VALID is released under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).  
These VRM conversions are shared under the same CC BY 4.0 terms.

## Related

- [TLTMedia/VRET](https://github.com/TLTMedia/VRET) — Virtual Reality Environment Toolkit that uses these avatars
