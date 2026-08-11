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
  applyYouthfulSmileBias,
  mergeHappyFamilyMorphs,
  mouthOpennessFromMorphs,
  YOUTHFUL_SMILE_BIAS,
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
  hasContinuityResidual,
  continuityResidualDeliverPulseClass,
  continuityResidualPulseDurationHud,
  continuityResidualPulsePeakHud,
  continuityResidualPulseCombinedHud,
  resolveContinuityResidualPulseBits,
  CONTINUITY_RESIDUAL_PULSE_DURATION_CAP_SEC,
  CONTINUITY_RESIDUAL_PULSE_PEAK_CAP,
  decayContinuityResidual,
  tuneContinuityResidualIntensity,
  continuityResidualDecayProgress,
  resetContinuityResidualPeak,
  continuityResidualBarStyle,
  CONTINUITY_RESIDUAL_PULSE_PEAK,
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
  noseTouchCue,
  gazeAversionCue,
  crossedArmsCue,
  chinTouchThinkingCue,
  napeTouchAnxietyCue,
  openPalmHonestyCue,
  applyEasterEggCue,
  mergeEasterEggCues,
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
  amplifyDisneyExtremeMorphs,
  classifyDisneyExtremeMorphKey,
  formatDisneyExtremeLiveHud,
  computeDisneyExtremeIntensities,
  DISNEY_EXTREME_DEFAULTS,
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
  attackCurve,
  blinkEnvelope,
  blinkIntervalSec,
  planMicroLeak,
  evaluateMicroLeak,
  BLINK_RATE,
  STEP_OUT_DURATION,
  ATTACK_DURATION,
  LEAK_BIAS,
  EMOTION_TIMING,
  TIMING_DEFAULTS,
  getEmotionTiming,
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
  syntheticArkitAt,
  SoakStats,
  soakPublisher,
  soakHttp,
  assertLiveLinkFrameShape,
} from './export/liveLinkSoak.js';
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
export {
  CHASSIS_CATALOG,
  CHASSIS,
  DEFAULT_CHASSIS,
  REGION_GAIN_MAP,
  listChassis,
  listChassisByProductLine,
  listChassisVariants,
  getChassis,
  resolvePackForChassis,
  applyDeadzone,
  calibrateJointValue,
  regionGainFor,
  calibrateRawJoints,
  ChassisSlewLimiter,
} from './export/chassisCalibrate.js';
export {
  CAPTURE_PROTOCOL,
  BAKE_PROTOCOL,
  GAZE_CHANNELS,
  BLINK_CHANNELS,
  buildArkitToExpression,
  arkitToMorphWeights,
  arkitToMuscleHints,
  normalizeCaptureFrame,
  parseCaptureTake,
  expressionEnergy,
  detectTemporalEnvelope,
  frameNearTime,
  sampleIntensityTiers,
  detectBlinks,
  bakeCaptureTake,
  mergeRecipeFragment,
} from './capture/captureBake.js';
export {
  MEDIAPIPE_CAPTURE_PROTOCOL,
  MEDIAPIPE_ALIASES,
  resolveMediaPipeChannel,
  mediaPipeCategoriesToArkit,
  mediaPipeResultToFrame,
  MediaPipeCaptureSession,
  arkitHudLines,
} from './capture/mediapipeArkit.js';
export {
  YT_CAPTURE_PROTOCOL,
  LM,
  landmarkBounds,
  scoreFaceQuality,
  filterCaptureFrames,
  resultsToFilteredTake,
  buildClipJob,
} from './capture/videoIngest.js';
export {
  envelopeToTimingRow,
  mergeTemporalEnvelopes,
} from './capture/temporalMerge.js';
export {
  TTS_PROVIDERS,
  detectTtsProvider,
  extractRawPhonemes,
  extractRawTags,
  normalizeTtsPayload,
  ttsToSpeechContext,
} from './tts/ttsAdapter.js';
export {
  wordToPhones,
  schedulePhones,
  estimatePhonemesFromWords,
  estimatePhonemesFromText,
} from './tts/estimatePhonemes.js';
export { SpeechPlayer, frameAtTime } from './tts/speechPlayer.js';
export { synthesizeTimingToneWav, timingToneObjectUrl } from './tts/demoAudio.js';
export { mouthChannelsToMorphWeights } from './tts/mouthMorphs.js';
export {
  resolveAudioUrl,
  MockTtsProvider,
  HttpTtsProvider,
  createTtsProvider,
  playWithProvider,
  DEFAULT_TTS_ENDPOINT,
} from './tts/ttsProvider.js';
export {
  CONTROL_RIG_REMAP_CATALOG,
  DEFAULT_REMAP_PROFILE,
  listRemapProfiles,
  getRemapProfile,
  invertRemap,
  remapArkitToMorphs,
  remapMorphsToArkit,
  remapLiveLinkFrame,
} from './export/controlRigRemap.js';
export {
  digitCurl,
  fingerSpread,
  articulateFingers,
} from './export/fingerArticulation.js';
export {
  FINGER_PRESET_CATALOG,
  DEFAULT_FINGER_PRESET,
  listFingerPresets,
  getFingerPreset,
  resolveFingerPreset,
} from './export/fingerPresets.js';
export {
  EMBLEM_FINGER_SYNC,
  EMBLEM_TO_FINGER,
  FINGER_TO_EMBLEM,
  AFFECT_TO_FINGER,
  ADAPTOR_TO_FINGER,
  fingerPresetForEmblem,
  emblemForFingerPreset,
  fingerPresetForAffect,
  fingerPresetForAdaptor,
  syncEmblemToFinger,
  syncFingerToEmblem,
  syncAffectToFinger,
  syncAdaptorToFinger,
} from './export/emblemFingerSync.js';
export {
  TTS_CONFIG_KEYS,
  resolveTtsConfig,
  createTtsProviderFromConfig,
  setBrowserTtsConfig,
} from './tts/ttsConfig.js';
export {
  TTS_PRESET_CATALOG,
  DEFAULT_TTS_PRESET,
  TTS_GATEWAY_ENV_KEY,
  expandEndpointTemplate,
  resolveGatewayBase,
  listTtsPresets,
  getTtsPreset,
  applyTtsPreset,
  createTtsProviderFromPreset,
} from './tts/ttsPresets.js';
export {
  startAuthEchoServer,
  runAuthenticatedTtsSmoke,
} from './tts/ttsSmoke.js';
export {
  FACE_LIVE_PREFS_KEY,
  FACE_LIVE_PREFS_VERSION,
  defaultFaceLivePrefs,
  disneyExtremeUiDefaults,
  resolveDisneyExtremeHotkey,
  summarizeDisneyExtremePrefs,
  normalizeFaceLivePrefs,
  loadFaceLivePrefs,
  saveFaceLivePrefs,
  clearFaceLivePrefs,
  compactPrefsForHash,
  encodePrefsHash,
  decodePrefsHash,
  loadFaceLivePrefsFromHash,
  buildPrefsShareUrl,
  exportFaceLivePrefsJson,
  importFaceLivePrefsJson,
} from './ui/faceLivePrefs.js';
export {
  healthUrlForEndpoint,
  probeTtsGateway,
  computeHealthPollInterval,
  applyHealthPollJitter,
  startGatewayHealthPoll,
  stopGatewayHealthPoll,
} from './tts/ttsHealth.js';
export {
  GATEWAY_HEALTH_HISTORY_MAX,
  normalizeHealthSample,
  summarizeHealthHistory,
  formatHealthSlaChip,
  describeProbeToastSlaBadge,
  buildProbeToastSparkMini,
  buildHealthSparklineSeries,
  buildHealthSparklineSvg,
  resolveSparklineProbeAt,
  formatHealthProbeDetail,
  buildHealthProbeCopyPayload,
  buildHealthProbeMarkdownPayload,
  PROBE_DETAIL_TOAST_DISMISS_MS,
  PROBE_TOAST_ACTIONS,
  describeHealthProbeToast,
  resolveProbeToastAction,
  resolveProbeToastShortcut,
  createGatewayHealthHistory,
} from './tts/ttsHealthHistory.js';
export {
  AFFECT_ALIASES,
  resolveAffectKey,
  affectStagingBand,
  affectBandScale,
  stageAffect,
  stageCompoundAffect,
} from './export/affectStaging.js';
export {
  PREFS_SHARE_DEFAULT_PATH,
  buildPrefsShortLink,
  buildPrefsQrImageUrl,
  buildPrefsQrFingerprintSvg,
  buildPrefsShareBundle,
  buildShareBundleAuditPayload,
} from './ui/prefsShareLink.js';
export {
  PREFS_LANDING_DISMISS_MS,
  formatPrefsLandingSummary,
  describePrefsDeepLink,
} from './ui/prefsLandingToast.js';
export {
  PREFS_LINK_TTL_MS,
  stampPrefsForShare,
  evaluatePrefsLinkExpiry,
  describePrefsLinkRevoke,
} from './ui/prefsLinkExpiry.js';
export {
  PREFS_SHARE_AUDIT_MAX,
  PREFS_SHARE_AUDIT_KEY,
  normalizeShareAuditEntry,
  formatShareAuditLog,
  filterShareAuditEntries,
  resolveAuditDateRange,
  listShareAuditActions,
  exportShareAuditJson,
  createPrefsShareAudit,
} from './ui/prefsShareAudit.js';
export {
  AUDIT_SAVED_VIEWS_KEY,
  AUDIT_SAVED_VIEWS_MAX,
  normalizeAuditSavedView,
  snapshotAuditView,
  groupAuditViewsByFolder,
  reorderAuditSavedViews,
  applyAuditViewsOrder,
  sortAuditViewsByStar,
  filterAuditSavedViews,
  clearStarsInFolder,
  pruneUnstarredViews,
  mergeAuditSavedViewsImport,
  resolveAuditViewsImportFilters,
  formatAuditViewsImportInheritHint,
  summarizeAuditViewsImportPreview,
  formatAuditViewsImportDryRunMergeHint,
  formatAuditViewsImportDryRunFilterSummary,
  formatAuditViewsImportDryRunSkipBreakdown,
  previewAuditViewsImportDryRun,
  shouldAutoImportAuditViewsOnDrop,
  exportAuditSavedViewsJson,
  importAuditSavedViewsJson,
  renameAuditSavedView,
  nextDuplicateViewName,
  compactAuditViewForShare,
  expandAuditViewFromShare,
  encodeAuditViewHash,
  decodeAuditViewHash,
  buildAuditViewShareSnapshot,
  createAuditSavedViews,
} from './ui/auditSavedViews.js';
export {
  cycleProbeToastFocusIndex,
  resolveProbeToastFocusTrap,
  createProbeToastFocusTrap,
} from './ui/probeToastFocusTrap.js';
export {
  resolveProbeToastHoverPause,
  computeProbeToastRemainingMs,
  createProbeToastDismissTimer,
} from './ui/probeToastDismiss.js';
export {
  PROBE_TOAST_HISTORY_MAX,
  normalizeProbeToastHistoryEntry,
  createProbeToastHistory,
} from './ui/probeToastHistory.js';
export { compareProbeToastDetails } from './ui/probeToastCompare.js';
export {
  PROBE_TOAST_SOUND_FREQ,
  PROBE_TOAST_SOUND_BASE_GAIN,
  PROBE_TOAST_SOUND_DUCK_FACTOR,
  PROBE_TOAST_SOUND_MIN_INTERVAL_MS,
  clampProbeToastVolume,
  effectiveProbeToastVolume,
  resolveProbeToastSoundRateLimit,
  resolveProbeToastSound,
  createProbeToastSound,
} from './ui/probeToastSound.js';
export {
  PROBE_TOAST_HAPTIC_PATTERN,
  resolveProbeToastHaptic,
  createProbeToastHaptic,
} from './ui/probeToastHaptic.js';
export {
  createLinkedProbeToastMute,
  formatProbeToastFeedbackSummary,
  applyProbeToastFeedbackFromPrefs,
} from './ui/probeToastFeedback.js';
export {
  COMPOUND_TO_EMBLEM,
  COMPOUND_EMBLEM_HOLD_SEC,
  COMPOUND_EMBLEM_RELEASE_SEC,
  emblemForCompound,
  crossfadeEase,
  lerpGesture,
  crossfadeCompoundToEmblem,
  compoundEmblemLifecycle,
  cancelCompoundEmblemLifecycle,
} from './export/compoundEmblemCrossfade.js';
