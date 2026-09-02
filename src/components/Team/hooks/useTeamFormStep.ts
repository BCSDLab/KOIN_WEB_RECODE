import { useCallback } from 'react';
import { useRouter } from 'next/router';

/**
 * 팀원 모집 프로필/지원서 작성 폼의 스텝을 URL 쿼리(`?step=`)로 관리한다.
 * 첫 스텝에서 뒤로 갈 때 어디로 나갈지는 페이지마다 다르므로 `onExitFirstStep`으로 주입받는다.
 */
function useTeamFormStep<T extends string>(
  steps: T[],
  defaultStep: T,
  buildStepHref: (step: T) => string,
  onExitFirstStep: () => void,
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
      nextStep(steps[currentIndex - 1]);
      return;
    }
    onExitFirstStep();
  }, [steps, currentStep, nextStep, onExitFirstStep]);

  return {
    currentStep,
    nextStep,
    goBack,
    isReady: router.isReady,
  };
}

export default useTeamFormStep;
