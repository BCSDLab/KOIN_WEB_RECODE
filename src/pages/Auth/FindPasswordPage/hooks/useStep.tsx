import { ReactNode, ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useStep<T extends string>(initialStep: T) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<T>(initialStep);

  const nextStep = (next: T) => setCurrentStep(next);
  const goBack = () => {
    navigate(-1);
  };

  function Step({
    name,
    step,
    children,
  }: {
    name: T;
    step: T;
    children: ReactNode;
  }): ReactElement | null {
    return step === name ? <div>{children}</div> : null;
  }

  return {
    currentStep,
    nextStep,
    goBack,
    Step,
  };
}

export default useStep;
