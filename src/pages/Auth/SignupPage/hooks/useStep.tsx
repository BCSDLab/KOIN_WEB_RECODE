/* eslint-disable react/jsx-no-useless-fragment */
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ROUTES from 'static/routes';

function useStep<T extends string>(steps: T[]) {
  const navigate = useNavigate();
  const { currentStep } = useParams<{ currentStep: T }>();

  if (!currentStep) {
    throw new Error('URL parameter \'currentstep\' is required for signup flow.');
  }
  const nextStep = useCallback((next: T, options?: { replace: boolean }) => {
    navigate(ROUTES.AuthSignup({ currentStep: next, isLink: true }), options);
  }, [navigate]);

  const goBack = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      nextStep(previousStep);
    } else {
      navigate(ROUTES.Auth());
    }
  }, [steps, currentStep, nextStep, navigate]);

  function Step({ name, children }: { name: T; children: React.ReactNode }) {
    return currentStep === name ? <>{children}</> : null;
  }

  return {
    currentStep, nextStep, goBack, Step,
  };
}

export default useStep;
