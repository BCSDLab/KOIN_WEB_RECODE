import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useStep<T extends string>(initialStep: T) {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<T>(initialStep);

  const nextStep = (step: T) => setCurrentStep(step);
  const goBack = () => {
    navigate(-1);
  };

  function Step({
    name,
    current,
    children,
  }: {
    name: T;
    current: T;
    children: ReactNode;
  }) {
    return current === name ? <div>{children}</div> : null;
  }

  return {
    currentStep,
    nextStep,
    goBack,
    Step,
  };
}

export default useStep;
