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
