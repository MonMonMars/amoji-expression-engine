/**
 * Billboard / sprite android face panel for robots without ARKit morphs
 * (GDBot / Gobot style screen faces).
 */

import { ANDROID_FACE_ASSETS } from './robotCharacterCatalog.js';
import {
  emotionToGdbotFacePart,
  emotionToGobotEyes,
} from './robotEmotionDrive.js';

export const ANDROID_FACE_PANEL_NAME = 'AmojiAndroidFacePanel';

/**
 * @param {import('three').Object3D} root
 * @returns {import('three').Object3D | null}
 */
export function findHeadAnchor(root) {
  let found = null;
  root.traverse((c) => {
    if (found) return;
    const n = (c.name || '').toLowerCase();
    if (n === 'head' || n.endsWith('.head') || n.includes('head')) found = c;
  });
  return found || root;
}

/**
 * Attach (or reuse) a face-panel plane parented to the head bone.
 * @param {typeof import('three')} THREE
 * @param {import('three').Object3D} model
 * @param {'gdbot'|'gobot'} kind
 * @param {import('three').TextureLoader} textureLoader
 */
export async function ensureAndroidFacePanel(THREE, model, kind, textureLoader) {
  const existing = model.getObjectByName(ANDROID_FACE_PANEL_NAME);
  if (existing) return existing;

  const assets = ANDROID_FACE_ASSETS[kind];
  if (!assets) return null;

  const initialUrl =
    kind === 'gdbot' ? assets.faces.eye_open : assets.open;
  const tex = await textureLoader.loadAsync(initialUrl);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;

  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const geo = new THREE.PlaneGeometry(0.28, 0.28);
  const panel = new THREE.Mesh(geo, mat);
  panel.name = ANDROID_FACE_PANEL_NAME;
  panel.userData.amojiAndroidFace = kind;
  panel.userData.textureLoader = textureLoader;
  panel.userData.THREE = THREE;
  panel.userData.currentUrl = initialUrl;

  const head = findHeadAnchor(model);
  // Offset in front of head (model-space; robots vary — tune lightly)
  panel.position.set(0, kind === 'gdbot' ? 0.05 : 0.08, 0.22);
  head.add(panel);
  return panel;
}

/**
 * @param {import('three').Object3D | null} model
 * @param {string} emotion
 * @param {{ blink?: number }} [opts]
 */
export async function applyAndroidFaceEmotion(model, emotion, opts = {}) {
  if (!model) return null;
  const panel = model.getObjectByName(ANDROID_FACE_PANEL_NAME);
  if (!panel?.material?.map) return null;

  const kind = panel.userData.amojiAndroidFace;
  const loader = panel.userData.textureLoader;
  const THREE = panel.userData.THREE;
  if (!kind || !loader || !THREE) return null;

  let url;
  if (kind === 'gdbot') {
    const part = emotionToGdbotFacePart(emotion);
    url = ANDROID_FACE_ASSETS.gdbot.faces[part];
  } else {
    const eyes = emotionToGobotEyes(emotion, opts);
    const a = ANDROID_FACE_ASSETS.gobot;
    url = eyes === 'closed' ? a.closed : eyes === 'hurt' ? a.hurt : a.open;
  }

  if (!url || url === panel.userData.currentUrl) {
    return { kind, url: panel.userData.currentUrl };
  }

  const tex = await loader.loadAsync(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  const old = panel.material.map;
  panel.material.map = tex;
  panel.material.needsUpdate = true;
  panel.userData.currentUrl = url;
  old?.dispose?.();
  return { kind, url };
}
