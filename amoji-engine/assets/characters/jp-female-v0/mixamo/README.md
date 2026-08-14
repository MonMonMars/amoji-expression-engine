# Mixamo body clips (Adobe)

Adobe **Mixamo** body animations are used here for Sakura full-body motion in Face Live.

## Commercial use

Per [Adobe Mixamo FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html):

- Royalty-free for **personal, commercial, and non-profit** projects (games, film, apps)
- Free Adobe ID; Creative Cloud not required
- Attribution not required
- **Do not** redistribute raw Mixamo FBX/characters as standalone asset packs
- **Do not** use Mixamo content to train ML/AI systems ([Additional Terms](https://wwwimages2.adobe.com/content/dam/cc/en/legal/servicetou/Mixamo-Addl-Terms-en_US-20210623.pdf))

Shipped demo FBX files (`SambaDancing.fbx`, `mixamo.fbx`) come from the [three.js examples](https://github.com/mrdoob/three.js/tree/r178/examples/models/fbx) Mixamo redistributions for engine wiring. For production, download clips from [mixamo.com](https://www.mixamo.com/) (Without Skin / FBX) and drop them here, then pick them in Face Live.

## Recommended Mixamo download settings

1. Sign in at mixamo.com with your Adobe ID
2. Upload Sakura T-pose **or** download **Without Skin** animations for Y Bot
3. Format: **FBX** · Skin: **Without Skin** · Frames: 30 · Keyframe Reduction: none
4. Save into this folder; Face Live loads via `FBXLoader` + `SkeletonUtils.retargetClip`

## Bone map

Sakura / MB-Lab ↔ `mixamorig*` lives in `engine/layers/mixamoRetarget.js`.
