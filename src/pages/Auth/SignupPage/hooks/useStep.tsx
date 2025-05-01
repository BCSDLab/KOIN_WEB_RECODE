/* eslint-disable react/jsx-no-useless-fragment */
import { useNavigate, useParams } from 'react-router-dom';

function useStep<T extends string>() {
  const navigate = useNavigate();
  const { currentStep } = useParams<{ currentStep: T }>();

  if (!currentStep) {
    throw new Error('URL parameter \'currentstep\' is required for signup flow.');
  }

  const nextStep = (next: T) => {
    navigate(`/auth/signup/${next}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  function Step({ name, children }: { name: T; children: React.ReactNode }) {
    return currentStep === name ? <>{children}</> : null;
  }

  return {
    currentStep, nextStep, goBack, Step,
  };
}

export default useStep;
