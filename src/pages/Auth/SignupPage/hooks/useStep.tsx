/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react';

function useStep<T extends string>(initialStep: T) {
  const [currentStep, setCurrentStep] = useState<T>(initialStep);

  const nextStep = (next: T) => setCurrentStep(next);

  function Step({ name, children }: { name: T; children: React.ReactNode }) {
    return currentStep === name ? <>{children}</> : null;
  }

  return { currentStep, nextStep, Step };
}

export default useStep;
