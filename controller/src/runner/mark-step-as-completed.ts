import sdk from '../db/sdk.js';
import { assertRunDataWithCurrentStep, SimpipeStepStatusEnum } from './run-data.js';
import type RunData from './run-data.js';

export default async function markStepAsCompleted(
  context: { runData: RunData | undefined }): Promise<RunData> {
  assertRunDataWithCurrentStep(context);
  const { stepId } = context.runData.currentStep;
  await sdk.setStepAsEndedSuccess({ stepId });

  const startedStep = {
    ...context.runData.currentStep,
    status: SimpipeStepStatusEnum.Completed,
  };

  // Replace the current step with the updated one in the list of steps
  const steps = context.runData.steps.map((step) => {
    if (step.stepId === stepId) {
      return startedStep;
    }
    return step;
  });

  return {
    ...context.runData,
    steps,
    currentStep: startedStep,
  };
}
