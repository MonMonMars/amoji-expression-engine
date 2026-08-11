export { applyComplianceGate } from './compliance/complianceGate.js';
export {
  AIDisclosureModule,
  AntiAddictionModule,
  CrisisInterventionModule,
} from './compliance/complianceGate.js';
export {
  emotionFormulas,
  BASIC_EMOTIONS,
  evaluateEmotion,
  neutralParams,
  interpolateKeyframes,
} from './layers/emotionFormulas.js';
export { clamp, resolveIntensity } from './layers/intensity.js';
export {
  applyMusclePerimeter,
  getMusclePerimeterCap,
  MUSCLE_PERIMETER_TABLE,
  PERIMETER_EMOTIONS,
} from './layers/musclePerimeter.js';
export {
  charToViseme,
  textToVisemeSequence,
  normalizeVisemeKey,
  getVisemeRule,
  VISEME_TABLE,
} from './layers/viseme.js';
export {
  resolveMouth,
  emotionToMouthChannels,
  applyMouthToParams,
} from './layers/resolveMouth.js';
export { performSpeech } from './layers/performSpeech.js';
export {
  dominanceWeight,
  timedVisemeSequence,
  resolveMouthAtTime,
  resolveArticulatorAtTime,
  sampleCoarticulatedFrames,
  peakVisemeAt,
  DOMINANCE_TABLE,
} from './layers/coarticulation.js';
export {
  PERSONAS,
  AROUSAL_LADDER,
  VARIANT_ROTATE_SEC,
  getPersona,
  resolveBreath,
  pickIdleVariant,
  evaluateIdle,
  IdleController,
} from './layers/idleMode.js';
export {
  LATENCY_THRESHOLDS,
  FILLER_POOLS,
  latencyTier,
  pickFiller,
  improviseReaction,
  LatencyBridge,
} from './layers/latencyBridge.js';
export {
  COMPOUNDS,
  DEFAULT_OWNERSHIP,
  classifyFaceRegion,
  getCompound,
  mergeByRegion,
  evaluateCompound,
  compoundToMorphWeights,
} from './layers/compoundEmotion.js';
export {
  GAIT_NEUTRAL,
  GAIT_BY_EMOTION,
  evaluateGait,
  sampleWalkPose,
} from './layers/gait.js';
export {
  GESTURE_PRIORITY,
  GESTURE_EMBLEMS,
  GESTURE_ILLUSTRATORS,
  GESTURE_REGULATORS,
  GESTURE_AFFECT,
  GESTURE_ADAPTORS,
  GESTURE_POSES,
  GAP_SEC_FOR_ADAPTOR,
  getPose,
  scalePose,
  emblemSpeedBias,
  adaptorPoolForMood,
  pickAdaptor,
  resolveGestureLayer,
  sampleGesturePose,
  GestureController,
  applyGestureBones,
} from './layers/gesture.js';
export {
  SURFACE_LEVELS,
  SURFACE_LEVEL_IDS,
  getSurfaceLevel,
  emotionValence,
  emotionArousal,
  glowColorForValence,
  renderGlow,
  renderPixelFace,
  meshTexHintsForLevel,
  renderSurface,
  uncannyRiskTone,
} from './layers/surfaceRenderer.js';
export {
  BODY_NEUTRAL,
  BODY_BY_EMOTION,
  THREAT_FREEZE,
  GAZE_COMBO,
  classifyHeadGazeCombo,
  evaluateBody,
  sampleBodyPose,
  applyBodyBones,
  BodyController,
} from './layers/neckShoulder.js';
export {
  PHONEME_TO_VISEME,
  phonemeToViseme,
  normalizePhonemeEvents,
  phonemesToTimedVisemes,
  phonemeTimelineDuration,
  samplePhonemeTimedFrames,
  normalizeParalinguisticTags,
  paralinguisticToHook,
} from './layers/phonemeTiming.js';
export {
  SMILE_TYPES,
  SMILE_MORPH_RECIPES,
  PERSONA_DEFAULT_SMILE,
  PERSONA_LAUGH_ALLOWED,
  LAUGHTER_INTENSITY_GATE,
  defaultSmileForPersona,
  personaAllowsLaugh,
  contagionFreshness,
  scaleSmileRecipe,
  evaluateSmile,
  resolveHappyFamily,
  pdStep,
  sampleLaughBody,
  evaluateLaugh,
  happyFamilyMorphWeights,
  applyLaughBones,
  SmileLaughController,
} from './layers/smileLaugh.js';
export {
  EYE_ONLY_DEG,
  MIXED_MAX_DEG,
  GAZE_MODES,
  PUPIL_PROFILES,
  headEyeShare,
  resolveHeadEye,
  applyVor,
  pupilScaleForEmotion,
  fixationMicro,
  presentationLook,
  resolveGazeDirection,
  evaluateEyes,
  EyeController,
} from './layers/eyeAnchor.js';
export {
  SCRIPT_GAZE,
  MOOD_SUPPRESSION,
  SCRIPT_EXAMPLE,
  validateScriptLine,
  normalizeScriptLine,
  applyMoodBiasToLine,
  matchCompound,
  performScript,
} from './layers/scriptLine.js';
export {
  MOODS,
  MOOD_TRANSITION_HALF_LIFE_SEC,
  getMoodDef,
  moodBlendAlpha,
  applyMoodBias,
  moodIdleBaseline,
  moodSignatureLeak,
  MoodController,
} from './layers/moodEngine.js';
export {
  BODY_FRONT,
  BODY_BACK,
  BODY_POINTS,
  BODY_POINT_COUNT,
  FACE_POINT_COUNT,
  FULL_BODY_POINT_BUDGET,
  BONE_MAP,
  getBodyPoint,
  bodyPointToBone,
  emptyBodyDeltas,
  retargetLayerB,
  retargetLayerW,
  retargetLayerG,
  mergeBodyDeltas,
  retargetBody,
} from './layers/bodyRetarget.js';
export {
  CONTINUITY_DECAY_HALF_LIFE_SEC,
  IMPROV_COOLDOWN_SEC,
  personalityProfile,
  applyContinuity,
  passiveMoodLeak,
  canImprovise,
  discretionaryImprovise,
  DiscretionController,
} from './layers/discretion.js';
export {
  EASTER_EGG_DISCLAIMER,
  EASTER_EGGS,
  personaAllowsEasterEggs,
  getEasterEgg,
  listEasterEggs,
  resolveEasterEgg,
  nlpGazeCue,
} from './easterEggs/index.js';
export {
  EMOTIONS,
  HI_RECIPES,
  SCULPT_RECIPES,
  INTENSITY_TIERS,
  emotionToMorphWeights,
  intensityTierWeights,
  recipeForIntensity,
  easeEmotionIntensity,
  applyMorphWeights,
  mergeMorphOverlays,
  normalizeMorphName,
} from './layers/emotionMorphs.js';
export {
  lookToEyeMorphWeights,
  saccadeOffset,
  mergeEyeWeights,
} from './layers/eyeLook.js';
export {
  TemporalLayer,
  stepOutCurve,
  blinkEnvelope,
  blinkIntervalSec,
  planMicroLeak,
  evaluateMicroLeak,
  BLINK_RATE,
  STEP_OUT_DURATION,
} from './layers/temporalLayer.js';
export {
  TEX_LODS,
  texturePackUrls,
  classifyMaterial,
  applyTexturePack,
} from './layers/textureLod.js';
export {
  ARKIT_CHANNELS,
  ARKIT_MAPPING,
  emptyArkitWeights,
  morphWeightsToArkit,
  muscleActivationsToArkit,
  mergeArkitWeights,
  arkitNonZero,
} from './export/arkitExporter.js';
export {
  LIVELINK_PROTOCOL,
  buildLiveLinkFrame,
  morphsToLiveLinkFrame,
  encodeLiveLinkLine,
  LiveLinkPublisher,
} from './export/liveLinkFace.js';
export {
  ROBOT_CATALOG,
  ROBOT_PACKS,
  DEFAULT_ROBOT_PACK,
  ROBOT_PROTOCOL,
  listRobotPacks,
  getRobotPack,
  emotionToFaceHints,
  mapFrameToJoints,
  clampJoints,
  robotJointsNonZero,
  driveRobot,
  encodeRobotLine,
  RobotDriverPublisher,
} from './export/robotDriver.js';
