/**
 * Big-name robot vendors and SDK readiness for Amoji emotion bridging.
 * `adaptable: true` means Face Live emits a concrete `amoji.robotVendor.v1` payload.
 */

/**
 * @typedef {object} RobotVendor
 * @property {string} id
 * @property {string} label
 * @property {string} company
 * @property {string[]} products
 * @property {string} sdk
 * @property {string} docs
 * @property {boolean} adaptable
 * @property {'full'|'partial'|'stub'} depth
 * @property {string} help
 * @property {boolean} [demoOnly]
 */

/** @type {RobotVendor[]} */
export const ROBOT_VENDORS = [
  {
    id: 'unitree',
    label: 'Unitree (Go2 / G1 / H1)',
    company: 'Unitree Robotics',
    products: ['Go2', 'B2', 'G1', 'H1'],
    sdk: 'unitree_sdk2 / unitree_sdk2_python / unitree_ros2',
    docs: 'https://www.unitree.com/opensource',
    adaptable: true,
    depth: 'full',
    help: 'Sport / Loco / Arm / VUI / LED — see unitreeBridge.js',
  },
  {
    id: 'boston_dynamics_spot',
    label: 'Boston Dynamics Spot',
    company: 'Boston Dynamics',
    products: ['Spot', 'Spot CAM'],
    sdk: 'bosdyn Spot SDK (Python/C++)',
    docs: 'https://dev.bostondynamics.com/',
    adaptable: true,
    depth: 'full',
    help: 'AudioVisualClient LEDs + buzzer; optional sit/stand',
  },
  {
    id: 'softbank_pepper',
    label: 'SoftBank Pepper',
    company: 'SoftBank Robotics',
    products: ['Pepper'],
    sdk: 'NAOqi / QiSDK (Android)',
    docs: 'http://doc.aldebaran.com/',
    adaptable: true,
    depth: 'full',
    help: 'ALLeds + ALAnimatedSpeech / animations + TTS',
  },
  {
    id: 'softbank_nao',
    label: 'SoftBank NAO',
    company: 'SoftBank Robotics',
    products: ['NAO'],
    sdk: 'NAOqi 2.x',
    docs: 'http://doc.aldebaran.com/',
    adaptable: true,
    depth: 'full',
    help: 'Same NAOqi stack — LEDs, posture, animated speech',
  },
  {
    id: 'misty',
    label: 'Misty Robotics II',
    company: 'Misty Robotics',
    products: ['Misty II'],
    sdk: 'HTTP REST + JS/.NET skills',
    docs: 'https://docs.mistyrobotics.com/',
    adaptable: true,
    depth: 'full',
    help: 'POST /api/led + /api/images/display + arms/head',
  },
  {
    id: 'temi',
    label: 'temi',
    company: 'Robotemi',
    products: ['temi', 'temi v3'],
    sdk: 'temi Android SDK / Kotlin',
    docs: 'https://github.com/robotemi/sdk',
    adaptable: true,
    depth: 'partial',
    help: 'speak() + skidJoy + facial status / navigation',
  },
  {
    id: 'xiaomi_cyberdog',
    label: 'Xiaomi CyberDog',
    company: 'Xiaomi',
    products: ['CyberDog', 'CyberDog 2'],
    sdk: 'CyberDog ROS2 / open-source repos',
    docs: 'https://github.com/MiRoboticsLab',
    adaptable: true,
    depth: 'partial',
    help: 'Sport-like motion topics + LED strips (ROS2)',
  },
  {
    id: 'ubtech',
    label: 'UBTECH Walker / Alpha',
    company: 'UBTECH Robotics',
    products: ['Walker', 'Alpha Mini', 'Cruzr'],
    sdk: 'UBTECH developer / Alpha Mini SDK',
    docs: 'https://www.ubtrobot.com/',
    adaptable: true,
    depth: 'partial',
    help: 'Action/emotion tags + TTS (vendor app bridge)',
  },
  {
    id: 'anybotics',
    label: 'ANYbotics ANYmal',
    company: 'ANYbotics',
    products: ['ANYmal D/X/J'],
    sdk: 'ANYmal ROS2 / customer SDK',
    docs: 'https://www.anybotics.com/',
    adaptable: true,
    depth: 'partial',
    help: 'ROS2 status lights / gait mode hints (site-specific)',
  },
  {
    id: 'pal_robotics',
    label: 'PAL Robotics ARI / TIAGo',
    company: 'PAL Robotics',
    products: ['ARI', 'TIAGo', 'TALOS'],
    sdk: 'ROS / ROS2 + web GUI',
    docs: 'https://pal-robotics.com/',
    adaptable: true,
    depth: 'partial',
    help: 'play_motion + LED / TTS topics',
  },
  {
    id: 'robotis',
    label: 'ROBOTIS OP3 / TurtleBot',
    company: 'ROBOTIS',
    products: ['OP3', 'TurtleBot3', 'AI Worker'],
    sdk: 'ROS / ROS2 Dynamixel',
    docs: 'https://emanual.robotis.com/',
    adaptable: true,
    depth: 'partial',
    help: 'OP3 action modules + TurtleBot LED',
  },
  {
    id: 'engineered_arts',
    label: 'Engineered Arts Ameca',
    company: 'Engineered Arts',
    products: ['Ameca', 'Mesmer'],
    sdk: 'Tritium / proprietary API',
    docs: 'https://www.engineeredarts.co.uk/',
    adaptable: true,
    depth: 'partial',
    help: 'Facial animation channels + gesture clips (partner API)',
  },
  {
    id: 'sony_aibo',
    label: 'Sony aibo',
    company: 'Sony',
    products: ['ERS-1000 aibo'],
    sdk: 'aibo Developer API (restricted)',
    docs: 'https://developer.aibo.com/',
    adaptable: true,
    depth: 'partial',
    help: 'Eyes/ears LEDs + behavior API (needs aibo Cloud auth)',
  },
  {
    id: 'universal_robots',
    label: 'Universal Robots (UR)',
    company: 'Universal Robots',
    products: ['UR3e–UR20'],
    sdk: 'URScript / RTDE / ROS',
    docs: 'https://www.universal-robots.com/',
    adaptable: true,
    depth: 'partial',
    help: 'Dashboard + script pose expressive waypoints (arm only)',
  },
  {
    id: 'agility_digit',
    label: 'Agility Robotics Digit',
    company: 'Agility Robotics',
    products: ['Digit'],
    sdk: 'Agility Arc / partner SDK',
    docs: 'https://www.agilityrobotics.com/',
    adaptable: true,
    depth: 'stub',
    help: 'No public emotion API — gesture intent stubs only',
  },
  {
    id: 'figure_ai',
    label: 'Figure AI',
    company: 'Figure',
    products: ['Figure 01', 'Figure 02'],
    sdk: 'No public SDK',
    docs: 'https://www.figure.ai/',
    adaptable: true,
    depth: 'stub',
    help: 'Closed platform — intent-only payload for future partner bridge',
  },
  {
    id: 'tesla_optimus',
    label: 'Tesla Optimus',
    company: 'Tesla',
    products: ['Optimus'],
    sdk: 'No public SDK',
    docs: 'https://www.tesla.com/AI',
    adaptable: true,
    depth: 'stub',
    help: 'Closed platform — intent-only stub',
  },
  {
    id: 'apptronik',
    label: 'Apptronik Apollo',
    company: 'Apptronik',
    products: ['Apollo'],
    sdk: 'Partner SDK',
    docs: 'https://apptronik.com/',
    adaptable: true,
    depth: 'stub',
    help: 'Partner-only — intent stub',
  },
  {
    id: 'fourier',
    label: 'Fourier Intelligence',
    company: 'Fourier Intelligence',
    products: ['GR-1', 'GR-2'],
    sdk: 'Fourier open / ROS packages (varies)',
    docs: 'https://www.fftai.com/',
    adaptable: true,
    depth: 'stub',
    help: 'Emerging humanoid SDK — intent + LED stub',
  },
  {
    id: 'deep_robotics',
    label: 'Deep Robotics',
    company: 'Deep Robotics',
    products: ['X30', 'Lite3'],
    sdk: 'Deep Robotics SDK / ROS',
    docs: 'https://www.deeprobotics.cn/',
    adaptable: true,
    depth: 'partial',
    help: 'Quadruped sport-mode style actions (similar to Unitree mapping)',
  },
  {
    id: 'ros2_expressive',
    label: 'ROS 2 expressive (generic)',
    company: 'Open Robotics / community',
    products: ['any ROS 2 robot'],
    sdk: 'rclpy / rclcpp + std msgs',
    docs: 'https://docs.ros.org/',
    adaptable: true,
    depth: 'full',
    help: 'Canonical topics: /amoji/emotion, /amoji/led, /amoji/gesture',
  },
];

/** @param {string} id */
export function getRobotVendor(id) {
  return ROBOT_VENDORS.find((v) => v.id === id) || ROBOT_VENDORS[0];
}

export function listAdaptableVendors() {
  return ROBOT_VENDORS.filter((v) => v.adaptable);
}
