import { useCallback } from 'react';
import { useRouter } from 'next/router';
import ROUTES from 'static/routes';

function useStep<T extends string>(steps: T[]) {
  const router = useRouter();
  const { id } = router.query as { id?: T };

  const nextStep = useCallback(
    (next: T, options?: { replace: boolean }) => {
      if (options?.replace) {
        router.replace(ROUTES.AuthSignup({ currentStep: next, isLink: true }));
      } else {
        router.push(ROUTES.AuthSignup({ currentStep: next, isLink: true }));
      }
    },
    [router],
  );

  const goBack = useCallback(() => {
    if (!id) return;
    const currentIndex = steps.indexOf(id);
    if (currentIndex > 0) {
      const previousStep = steps[currentIndex - 1];
      nextStep(previousStep);
    } else {
      router.push(ROUTES.Auth());
    }
  }, [steps, id, nextStep, router]);

  if (!id) {
    return {
      currentStep: '약관동의' as const,
      nextStep: () => {},
      goBack: () => {},
      Step: () => null,
    };
  }

  function Step({ name, children }: { name: T; children: React.ReactNode }) {
    return id === name ? <>{children}</> : null;
  }

  const currentStep = id;

  return {
    currentStep,
    nextStep,
    goBack,
    Step,
  };
}

export default useStep;
