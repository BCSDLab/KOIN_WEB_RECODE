import { useCallback } from 'react';
import { useRouter } from 'next/router';
import ROUTES from 'static/routes';

/**
 * 팀원 모집 프로필 작성 폼의 스텝을 URL 쿼리(`?step=`)로 관리한다.
 * `SignupPage/hooks/useStep`과 동일한 패턴이지만 라우트가 `ROUTES.AuthSignup`에 하드코딩되어 있어 재사용할 수 없다.
 */
function useProfileStep<T extends string>(steps: T[], defaultStep: T, buildStepHref: (step: T) => string) {
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
      nextStep(steps[currentIndex - 1]);
      return;
    }
    router.push(ROUTES.TeamProfile());
  }, [steps, currentStep, nextStep, router]);

  return {
    currentStep,
    nextStep,
    goBack,
    isReady: router.isReady,
  };
}

export default useProfileStep;
