/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function useStep<T extends string>(initialStep: T) {
  const [currentStep, setCurrentStep] = useState<T>(initialStep);
  const [historyStep, setHistoryStep] = useState<T[]>([initialStep]);
  const navigate = useNavigate();

  const nextStep = (next: T) => {
    setCurrentStep(next);
    setHistoryStep((prev) => [next, ...prev]);
  };

  const goBack = () => {
    if (historyStep.length <= 1) {
      navigate(-1);
      return;
    }
    setHistoryStep((prev) => {
      const newHistory = prev.slice(1);
      setCurrentStep(newHistory[0]);
      return newHistory;
    });
  };

  function Step({ name, children }: { name: T; children: React.ReactNode }) {
    return currentStep === name ? <>{children}</> : null;
  }

  return {
    currentStep, nextStep, goBack, Step,
  };
}

export default useStep;
