/**
 * Open robot / android character references for Face Live.
 * Sakura stays the brand hero — these are interop viewers for robotic bodies
 * and android-style face panels.
 */

/** @typedef {'gltf'} RobotFormat */

/**
 * @typedef {object} RobotCharacterRef
 * @property {string} id
 * @property {string} label
 * @property {RobotFormat} format
 * @property {string} url
 * @property {string} license
 * @property {string} help
 * @property {boolean} [robot] always true for picker grouping
 * @property {'expressive'} [robotMorphs] morph-target emotion set
 * @property {'gdbot'|'gobot'} [androidFace] sprite / texture face panel
 * @property {boolean} [demoOnly] true when license is NC or research-only
 * @property {string[]} [preferredClips] embedded animation names for idle/walk
 */

const R = '/assets/reference/robots';

/** @type {RobotCharacterRef[]} */
export const ROBOT_CHARACTER_REFS = [
  {
    id: 'robot-expressive',
    label: 'RobotExpressive · Quaternius (CC0)',
    format: 'gltf',
    url: `${R}/robot-expressive/RobotExpressive.glb`,
    license: 'CC0 1.0 — Tomás Laulhé / Quaternius (via three.js)',
    help: 'Humanoid robot with Angry / Surprised / Sad morphs + Idle/Walk clips',
    robot: true,
    robotMorphs: 'expressive',
    preferredClips: ['Idle', 'Walking', 'Running', 'Wave', 'Yes', 'No'],
  },
  {
    id: 'xbot',
    label: 'Mixamo X Bot · android body',
    format: 'gltf',
    url: `${R}/xbot/Xbot.glb`,
    license: 'Mixamo royalty-free (via three.js examples redistrib)',
    help: 'Classic Mixamo android — idle/walk/run + mixamorig: skeleton for retarget',
    robot: true,
    preferredClips: ['idle', 'walk', 'run'],
  },
  {
    id: 'cesium-man',
    label: 'CesiumMan · glTF sample',
    format: 'gltf',
    url: `${R}/cesium-man/CesiumMan.glb`,
    license: 'CC BY 4.0 — Cesium (attribute; trademark terms)',
    help: 'Classic walking robot from Khronos glTF sample models',
    robot: true,
    preferredClips: ['animation_0', 'Take 001'],
  },
  {
    id: 'gdbot',
    label: 'GDBot · android face (demo NC)',
    format: 'gltf',
    url: `${R}/gdquest-gdbot/gdbot.glb`,
    license: 'CC BY-NC-SA 4.0 art — GDQuest (demo only)',
    help: 'Android mascot + face-panel emotion sprites (non-commercial demo)',
    robot: true,
    androidFace: 'gdbot',
    demoOnly: true,
    preferredClips: ['Idle', 'walk', 'run'],
  },
  {
    id: 'gobot',
    label: 'Gobot · eye panel (demo NC)',
    format: 'gltf',
    url: `${R}/gdquest-gobot/gobot.glb`,
    license: 'CC BY-NC-SA 4.0 art — GDQuest (demo only)',
    help: 'Compact robot with open/hurt/closed eye textures (non-commercial demo)',
    robot: true,
    androidFace: 'gobot',
    demoOnly: true,
    preferredClips: ['Idle', 'Walk', 'Run'],
  },
];

/** @param {string} id */
export function getRobotCharacterRef(id) {
  return ROBOT_CHARACTER_REFS.find((r) => r.id === id) || null;
}

/** Absolute paths for android face panel textures. */
export const ANDROID_FACE_ASSETS = {
  gdbot: {
    base: `${R}/gdquest-gdbot/`,
    open: `${R}/gdquest-gdbot/open.png`,
    closed: `${R}/gdquest-gdbot/closed.png`,
    faces: {
      eye_open: `${R}/gdquest-gdbot/faces/eye_open.png`,
      eye_close: `${R}/gdquest-gdbot/faces/eye_close.png`,
      eye_happy: `${R}/gdquest-gdbot/faces/eye_happy.png`,
      eye_spiral: `${R}/gdquest-gdbot/faces/eye_spiral.png`,
      smile: `${R}/gdquest-gdbot/faces/smile.png`,
      open_mouth: `${R}/gdquest-gdbot/faces/open_mouth.png`,
    },
  },
  gobot: {
    base: `${R}/gdquest-gobot/`,
    open: `${R}/gdquest-gobot/open_eye.png`,
    closed: `${R}/gdquest-gobot/closed_eyes.png`,
    hurt: `${R}/gdquest-gobot/hurt_eyes.png`,
  },
};
