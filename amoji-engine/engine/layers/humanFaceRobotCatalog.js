/**
 * Human-faced / social android robots — companies whose product is an
 * expressive human(oid) face (projected, screen, or mechatronic).
 */

/**
 * @typedef {object} HumanFaceRobotVendor
 * @property {string} id
 * @property {string} label
 * @property {string} company
 * @property {string[]} products
 * @property {string} sdk
 * @property {string} docs
 * @property {boolean} adaptable
 * @property {'full'|'partial'|'stub'} depth
 * @property {string} help
 * @property {true} humanFace
 * @property {'arkit'|'video'|'dof'|'screen'|'intent'} faceDrive
 */

/** @type {HumanFaceRobotVendor[]} */
export const HUMAN_FACE_ROBOT_VENDORS = [
  {
    id: 'furhat',
    label: 'Furhat Robotics',
    company: 'Furhat Robotics',
    products: ['Furhat'],
    sdk: 'Furhat Remote API (HTTP :54321) + Kotlin skill SDK',
    docs: 'https://docs.furhat.io/remote-api/',
    adaptable: true,
    depth: 'full',
    help: 'FaceCore ARKitParams / CharParams gestures — best ARKit interop',
    humanFace: true,
    faceDrive: 'arkit',
  },
  {
    id: 'engineered_arts',
    label: 'Engineered Arts Ameca / Mesmer',
    company: 'Engineered Arts',
    products: ['Ameca', 'Ameca Desktop', 'Mesmer', 'Ami', 'Azi'],
    sdk: 'Tritium (cloud) + partner DOF API',
    docs: 'https://www.engineeredarts.co.uk/',
    adaptable: true,
    depth: 'full',
    help: '50+ expressions; per-DOF brows/eyes/cheeks/jaw/lips',
    humanFace: true,
    faceDrive: 'dof',
  },
  {
    id: 'qtrobot',
    label: 'LuxAI QTrobot',
    company: 'LuxAI',
    products: ['QTrobot', 'QTRD'],
    sdk: 'robot-sdk-python / qtrobot-sdk-js / ROS2',
    docs: 'https://docs.luxai.com/',
    adaptable: true,
    depth: 'full',
    help: 'robot.face.show_emotion("QT/happy") + eye gaze',
    humanFace: true,
    faceDrive: 'video',
  },
  {
    id: 'hanson_robotics',
    label: 'Hanson Robotics Sophia / Grace',
    company: 'Hanson Robotics',
    products: ['Sophia', 'Grace', 'Han'],
    sdk: 'Hanson AI / partner face motor API',
    docs: 'https://www.hansonrobotics.com/',
    adaptable: true,
    depth: 'partial',
    help: 'Named facial emotions + TTS lip sync (partner access)',
    humanFace: true,
    faceDrive: 'dof',
  },
  {
    id: 'softbank_pepper',
    label: 'SoftBank Pepper (tablet face)',
    company: 'SoftBank Robotics',
    products: ['Pepper'],
    sdk: 'NAOqi / QiSDK',
    docs: 'http://doc.aldebaran.com/',
    adaptable: true,
    depth: 'full',
    help: 'Tablet face + ALAnimatedSpeech (also in body vendor list)',
    humanFace: true,
    faceDrive: 'screen',
  },
  {
    id: 'misty',
    label: 'Misty II (screen face)',
    company: 'Misty Robotics',
    products: ['Misty II'],
    sdk: 'HTTP REST',
    docs: 'https://docs.mistyrobotics.com/',
    adaptable: true,
    depth: 'full',
    help: 'DisplayImage emotion files + chest LED',
    humanFace: true,
    faceDrive: 'screen',
  },
  {
    id: 'realbotix',
    label: 'Realbotix / Abyss Creator',
    company: 'Realbotix',
    products: ['RealDollX', 'Harmony', 'Abyss'],
    sdk: 'Abyss Creator / partner API',
    docs: 'https://realbotix.com/',
    adaptable: true,
    depth: 'partial',
    help: 'Desktop android face DOF + app bridge',
    humanFace: true,
    faceDrive: 'dof',
  },
  {
    id: 'icub',
    label: 'iCub (IIT)',
    company: 'Italian Institute of Technology',
    products: ['iCub'],
    sdk: 'YARP / iCub software',
    docs: 'https://icub.org/',
    adaptable: true,
    depth: 'partial',
    help: 'eyelids / mouth / LED eyebrows research face',
    humanFace: true,
    faceDrive: 'dof',
  },
  {
    id: 'reeti',
    label: 'Robopec Reeti',
    company: 'Robopec / SoftBank legacy',
    products: ['Reeti'],
    sdk: 'Reeti SDK / REST (legacy)',
    docs: 'https://www.reeti.fr/',
    adaptable: true,
    depth: 'partial',
    help: 'Mechatronic face motors (neck, eyelids, mouth)',
    humanFace: true,
    faceDrive: 'dof',
  },
  {
    id: 'emys',
    label: 'EMYS (Flash Robotics)',
    company: 'Flash Robotics',
    products: ['EMYS'],
    sdk: 'EMYS API / research',
    docs: 'https://emys.co/',
    adaptable: true,
    depth: 'partial',
    help: 'Spherical expressive face + gaze',
    humanFace: true,
    faceDrive: 'dof',
  },
  {
    id: 'promobot',
    label: 'Promobot',
    company: 'Promobot',
    products: ['Promobot V4', 'Robo-C'],
    sdk: 'Promobot SDK',
    docs: 'https://promo-bot.ai/',
    adaptable: true,
    depth: 'partial',
    help: 'Screen / mechatronic face emotions + dialogue',
    humanFace: true,
    faceDrive: 'screen',
  },
  {
    id: 'ex_robots',
    label: 'EX Robots',
    company: 'EX Robots',
    products: ['EX humanoid faces'],
    sdk: 'Partner / proprietary',
    docs: 'https://www.exrobots.com/',
    adaptable: true,
    depth: 'stub',
    help: 'Silicone face androids — partner DOF bridge',
    humanFace: true,
    faceDrive: 'dof',
  },
  {
    id: 'ishiguro_geminoid',
    label: 'Ishiguro Lab Geminoid / Erica',
    company: 'Hiroshi Ishiguro Laboratories / ATR',
    products: ['Geminoid', 'Erica', 'Ibuki'],
    sdk: 'Research teleop / ATR stacks',
    docs: 'https://www.geminoid.jp/',
    adaptable: true,
    depth: 'stub',
    help: 'Research android faces — intent / teleop stub',
    humanFace: true,
    faceDrive: 'intent',
  },
  {
    id: 'soul_machines',
    label: 'Soul Machines (digital human)',
    company: 'Soul Machines',
    products: ['Digital People'],
    sdk: 'Soul Machines Cloud API',
    docs: 'https://www.soulmachines.com/',
    adaptable: true,
    depth: 'partial',
    help: 'Web digital humans — emotion + viseme webhooks',
    humanFace: true,
    faceDrive: 'arkit',
  },
  {
    id: 'uneeq',
    label: 'Uneeq digital humans',
    company: 'Uneeq',
    products: ['Digital Humans'],
    sdk: 'Uneeq SDK / cloud',
    docs: 'https://www.uneeq.com/',
    adaptable: true,
    depth: 'partial',
    help: 'Browser digital humans — emotion events',
    humanFace: true,
    faceDrive: 'intent',
  },
  {
    id: 'embodied_moxie',
    label: 'Embodied Moxie',
    company: 'Embodied, Inc.',
    products: ['Moxie'],
    sdk: 'Partner / discontinued consumer',
    docs: 'https://embodied.com/',
    adaptable: true,
    depth: 'stub',
    help: 'Screen-face companion — intent stub',
    humanFace: true,
    faceDrive: 'screen',
  },
];

/** @param {string} id */
export function getHumanFaceRobotVendor(id) {
  return HUMAN_FACE_ROBOT_VENDORS.find((v) => v.id === id) || null;
}

export function listHumanFaceRobotVendors() {
  return HUMAN_FACE_ROBOT_VENDORS.slice();
}
