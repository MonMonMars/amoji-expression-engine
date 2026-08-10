import { AIDisclosureModule } from './aiDisclosure.js';
import { AntiAddictionModule } from './antiAddiction.js';
import { CrisisInterventionModule } from './crisisIntervention.js';

const aiDisclosureModule = new AIDisclosureModule();
const antiAddictionModule = new AntiAddictionModule();
const crisisModule = new CrisisInterventionModule();

/**
 * Mandatory gate between Layer outputs and any renderer.
 * Crisis check runs first and can fully replace the output.
 *
 * @param {import('../types.js').EngineOutput} rawOutput
 * @param {import('../types.js').ComplianceContext} [context]
 * @returns {import('../types.js').EngineOutput}
 */
export function applyComplianceGate(rawOutput, context = {}) {
  const crisisCheck = crisisModule.scanForDistressSignals(context.userText ?? '');
  if (crisisCheck.triggered) {
    return crisisModule.overrideResponse(crisisCheck);
  }

  aiDisclosureModule.onSessionStart(context.userContext ?? {});
  antiAddictionModule.checkThreshold(
    context.sessionDuration ?? 0,
    context.isMinor ?? false,
  );

  return {
    ...rawOutput,
    meta: {
      ...(rawOutput.meta ?? {}),
      compliance: 'passed',
    },
  };
}

export { AIDisclosureModule, AntiAddictionModule, CrisisInterventionModule };
