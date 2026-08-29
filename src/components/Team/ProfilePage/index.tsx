import { Suspense, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCreateTeamRecruitmentProfileMutation } from 'api/teamRecruitmentProfile/queries';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import SubPageHeader from 'components/ui/SubPageHeader';
import { FormProvider, useForm } from 'react-hook-form';
import ROUTES from 'static/routes';
import showToast from 'utils/ts/showToast';
import useProfileStep from './hooks/useProfileStep';
import ApplicationStep from './Steps/ApplicationStep';
import BasicInfoStep from './Steps/BasicInfoStep';
import { PROFILE_STEPS, type ProfileFormValues, type ProfileStepTitle } from './types';
import type { CreateTeamRecruitmentProfileRequest } from 'api/teamRecruitmentProfile/entity';
import styles from './ProfilePage.module.scss';

const toRequestBody = (values: ProfileFormValues): CreateTeamRecruitmentProfileRequest => ({
  nickname: values.nickname.trim(),
  department: values.department,
  student_number: values.studentNumber.trim(),
  preferred_role: values.preferredRole.trim(),
  skills: values.skills.map((skill) => skill.value.trim()).filter((skill) => skill.length > 0),
  activities: values.activities.map((activity) => ({
    title: activity.title.trim(),
    start_date: activity.startDate,
    // `<input type="date">`를 비우면 ''이 들어오므로 null로 정규화한다.
    end_date: activity.isOngoing ? null : activity.endDate || null,
    is_ongoing: activity.isOngoing,
    content: activity.content.trim(),
  })),
  introduction: values.introduction.trim(),
});

export default function TeamProfileForm() {
  const router = useRouter();
  const { currentStep, nextStep, goBack, isReady } = useProfileStep<ProfileStepTitle>(PROFILE_STEPS, '기본 정보');

  const methods = useForm<ProfileFormValues>({
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      department: '',
      studentNumber: '',
      preferredRole: '',
      skills: [],
      activities: [],
      introduction: '',
    },
  });

  const { mutate: createProfile, isPending } = useCreateTeamRecruitmentProfileMutation({
    onSuccess: () => {
      // TODO: 완료 모달/오버레이 디자인 확정 후 교체
      showToast('success', '프로필이 저장되었습니다.');
      router.push(ROUTES.TeamProfile());
    },
  });

  const goToFirstStep = useCallback(() => {
    nextStep('기본 정보', { replace: true });
  }, [nextStep]);

  useEffect(() => {
    if (!isReady || currentStep !== '지원서 작성') return;

    const { nickname, department, studentNumber } = methods.getValues();
    if (!nickname || !department || !studentNumber) {
      showToast('warning', '기본 정보를 먼저 입력해주세요.');
      goToFirstStep();
    }
  }, [isReady, currentStep, methods, goToFirstStep]);

  const handleSubmit = methods.handleSubmit(
    (values) => {
      if (values.activities.some((activity) => activity.status === 'draft')) {
        showToast('warning', '작성 중인 활동 이력을 완료해주세요.');
        return;
      }
      createProfile(toRequestBody(values));
    },
    (errors) => {
      // 1단계 필드가 비어 있으면 에러가 화면에 보이지 않으므로 1단계로 되돌린다.
      if (errors.nickname || errors.department || errors.studentNumber) {
        showToast('warning', '기본 정보를 먼저 입력해주세요.');
        goToFirstStep();
        return;
      }
      showToast('warning', '필수 항목을 모두 작성해주세요.');
    },
  );

  return (
    <div className={styles.container}>
      <SubPageHeader title="팀원 모집 프로필 작성" />

      <FormProvider {...methods}>
        <Suspense fallback={<LoadingSpinner size="50px" />}>
          {currentStep === '기본 정보' ? (
            <BasicInfoStep onNext={() => nextStep('지원서 작성')} />
          ) : (
            <ApplicationStep onBack={goBack} onSubmit={handleSubmit} isSubmitting={isPending} />
          )}
        </Suspense>
      </FormProvider>
    </div>
  );
}
