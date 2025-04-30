/* eslint-disable react/jsx-no-useless-fragment */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function useStep<T extends string>(initialStep: T) {
  const navigate = useNavigate();
  const { currentStep } = useParams<{ currentStep: T }>();
  const [historyStep, setHistoryStep] = useState<T[]>([initialStep]);

  if (!currentStep) {
    throw new Error('URL parameter \'currentstep\' is required for signup flow.');
  }

  const nextStep = (next: T) => {
    navigate(`/auth/signup/${next}`);
    setHistoryStep((prev) => [next, ...prev]);
  };

  const goBack = () => {
    if (historyStep.length <= 1) {
      navigate(-1);
      return;
    }
    setHistoryStep((prev) => {
      const newHistory = prev.slice(1);
      navigate(`/auth/signup/${newHistory}`);
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
