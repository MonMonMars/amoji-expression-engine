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
  EMOTIONS,
  HI_RECIPES,
  INTENSITY_TIERS,
  emotionToMorphWeights,
  intensityTierWeights,
  easeEmotionIntensity,
  applyMorphWeights,
  normalizeMorphName,
} from './layers/emotionMorphs.js';
export {
  lookToEyeMorphWeights,
  saccadeOffset,
  mergeEyeWeights,
} from './layers/eyeLook.js';
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
  TEX_LODS,
  texturePackUrls,
  classifyMaterial,
  applyTexturePack,
} from './layers/textureLod.js';
