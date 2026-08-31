import { useCallback } from 'react';
import { useRouter } from 'next/router';
import ROUTES from 'static/routes';

function useApplyStep<T extends string>(
  steps: T[],
  defaultStep: T,
  buildStepHref: (step: T) => string,
  postId: string,
) {
  const router = useRouter();
  const { step } = router.query as { step?: T };

  const currentStep = step && steps.includes(step) ? step : defaultStep;

  const nextStep = useCallback(
    (next: T, options?: { replace: boolean }) => {
      const href = buildStepHref(next);

      if (options?.replace) {
        router.replace(href);
        return;
      }
      router.push(href);
    },
    [router, buildStepHref],
  );

  const goBack = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex > 0) {
      router.back();
      return;
    }
    router.push(ROUTES.TeamDetail({ postId }));
  }, [steps, currentStep, router, postId]);

  return {
    currentStep,
    nextStep,
    goBack,
    isReady: router.isReady,
  };
}

export default useApplyStep;
