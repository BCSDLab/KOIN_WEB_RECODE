import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  teamRecruitmentProfileQueries,
  useUpsertTeamRecruitmentProfileMutation,
} from 'api/teamRecruitmentProfile/queries';
import SubmitConfirmModal from 'components/Team/components/SubmitConfirmModal';
import useTeamFormStep from 'components/Team/hooks/useTeamFormStep';
import SubPageHeader from 'components/ui/SubPageHeader';
import { FormProvider, useForm } from 'react-hook-form';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import { profileFormSchema, type ProfileFormValues } from './schema';
import ApplicationStep from './Steps/ApplicationStep';
import BasicInfoStep from './Steps/BasicInfoStep';
import { PROFILE_STEPS, type ProfileStepTitle, type TeamProfileFormMode } from './types';
import type {
  TeamRecruitmentProfileResponse,
  UpsertTeamRecruitmentProfileRequest,
} from 'api/teamRecruitmentProfile/entity';
import styles from './ProfilePage.module.scss';

interface TeamProfileFormProps {
  mode: TeamProfileFormMode;
}

const MODE_TEXT: Record<
  TeamProfileFormMode,
  {
    title: string;
    desktopTitle: string;
    submitLabel: string;
    confirmMessage: string;
    confirmLabel: string;
    successMessage: string;
  }
> = {
  create: {
    title: '팀원 모집 프로필 작성',
    desktopTitle: '프로필 작성',
    submitLabel: '저장',
    confirmMessage: '프로필을 저장하시겠어요?',
    confirmLabel: '저장하기',
    successMessage: '프로필이 저장되었습니다.',
  },
  edit: {
    title: '팀원 모집 프로필 수정',
    desktopTitle: '프로필 수정',
    submitLabel: '수정하기',
    confirmMessage: '프로필을 수정하시겠어요?',
    confirmLabel: '수정하기',
    successMessage: '프로필이 수정되었습니다.',
  },
};

const LOG_MODE: Record<TeamProfileFormMode, 'create' | 'modify'> = { create: 'create', edit: 'modify' };

const EMPTY_DEFAULT_VALUES: ProfileFormValues = {
  nickname: '',
  department: '',
  studentNumber: '',
  preferredRole: '',
  skills: [],
  activities: [],
  introduction: '',
};

function toDefaultValues(profile: TeamRecruitmentProfileResponse | null): ProfileFormValues {
  if (!profile) return EMPTY_DEFAULT_VALUES;

  return {
    nickname: profile.profile_nickname,
    department: profile.department,
    studentNumber: profile.student_number,
    preferredRole: profile.preferred_role,
    skills: profile.skills.map((skill) => ({ value: skill })),
    activities: profile.activities.map((activity) => ({
      id: String(activity.id),
      title: activity.title,
      startDate: activity.started_at,
      endDate: activity.ended_at,
      isOngoing: activity.is_ongoing,
      content: activity.description,
      status: 'saved' as const,
      hasBeenSaved: true,
    })),
    introduction: profile.self_introduction,
  };
}

const toRequestBody = (values: ProfileFormValues): UpsertTeamRecruitmentProfileRequest => ({
  profile_nickname: values.nickname.trim(),
  preferred_role: values.preferredRole.trim(),
  skills: values.skills.map((skill) => skill.value.trim()).filter((skill) => skill.length > 0),
  activities: values.activities.map((activity) => ({
    title: activity.title.trim(),
    started_at: activity.startDate,
    // `<input type="date">`를 비우면 ''이 들어오므로 null로 정규화한다.
    ended_at: activity.isOngoing ? null : activity.endDate || null,
    is_ongoing: activity.isOngoing,
    description: activity.content.trim(),
  })),
  self_introduction: values.introduction.trim(),
});

interface ProfileFormBodyProps {
  mode: TeamProfileFormMode;
  defaultValues: ProfileFormValues;
}

// create/edit가 공유하는 실제 폼 UI·제출 로직. defaultValues는 호출부(생성은 빈 값, 수정은 서버에서
// prefetch된 기존 프로필)가 이미 확정한 값을 그대로 받으므로, 여기서는 데이터 출처를 신경 쓰지 않는다.
function ProfileFormBody({ mode, defaultValues }: ProfileFormBodyProps) {
  const router = useRouter();
  const { actionEventClick } = useLogger();
  const isEditMode = mode === 'edit';
  const buildStepHref = (step: ProfileStepTitle) =>
    isEditMode ? ROUTES.TeamProfileEdit({ step }) : ROUTES.TeamProfileCreate({ step });
  const onExitFirstStep = () => router.push(ROUTES.TeamProfile());
  const { currentStep, nextStep, goBack, isReady } = useTeamFormStep<ProfileStepTitle>(
    PROFILE_STEPS,
    '기본 정보',
    buildStepHref,
    onExitFirstStep,
  );
  const [pendingValues, setPendingValues] = useState<ProfileFormValues | null>(null);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues,
  });

  const { mutate: upsertProfile, isPending } = useUpsertTeamRecruitmentProfileMutation({
    onSuccess: () => {
      setPendingValues(null);
      showToast('success', MODE_TEXT[mode].successMessage);
      router.push(ROUTES.TeamProfile());
    },
  });

  const goToFirstStep = () => {
    nextStep('기본 정보', { replace: true });
  };

  useEffect(() => {
    if (!isReady || currentStep !== '지원서 작성') return;

    const { nickname, department, studentNumber } = methods.getValues();
    if (!nickname || !department || !studentNumber) {
      showToast('warning', '기본 정보를 먼저 입력해주세요.');
      goToFirstStep();
    }
  }, [isReady, currentStep, methods, goToFirstStep]);

  // 저장/수정 버튼은 검증만 통과시키고, 실제 upsert는 확인 모달에서 승인해야 실행된다.
  // 작성 중인(draft) 활동 이력이 남아있으면 안 된다는 규칙은 profileFormSchema의 superRefine이 검증하므로,
  // 이 콜백이 호출된 시점엔 이미 통과된 상태다.
  const handleRequestSubmit = methods.handleSubmit(
    (values) => setPendingValues(values),
    (errors) => {
      // 1단계 필드가 비어 있으면 에러가 화면에 보이지 않으므로 1단계로 되돌린다.
      if (errors.nickname || errors.department || errors.studentNumber) {
        showToast('warning', '기본 정보를 먼저 입력해주세요.');
        goToFirstStep();
        return;
      }
      showToast('warning', errors.activities?.message ?? '필수 항목을 모두 작성해주세요.');
    },
  );

  const handleConfirmSubmit = () => {
    if (!pendingValues) return;
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'result',
      event_label: `team_recruitment_profile_${LOG_MODE[mode]}_submit_confirm`,
      value: MODE_TEXT[mode].confirmLabel,
    });
    upsertProfile(toRequestBody(pendingValues));
  };

  const handleCancelSubmit = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_label: `team_recruitment_profile_${LOG_MODE[mode]}_submit_cancel`,
      value: '취소하기',
    });
    setPendingValues(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <div className={styles.mobileHeader}>
          <SubPageHeader title={MODE_TEXT[mode].title} />
        </div>
        <h1 className={styles.title}>{MODE_TEXT[mode].desktopTitle}</h1>

        <FormProvider {...methods}>
          <Suspense fallback={null}>
            {currentStep === '기본 정보' ? (
              <BasicInfoStep mode={mode} onNext={() => nextStep('지원서 작성')} />
            ) : (
              <ApplicationStep
                mode={mode}
                onBack={goBack}
                onSubmit={handleRequestSubmit}
                isSubmitting={isPending}
                submitLabel={MODE_TEXT[mode].submitLabel}
              />
            )}
          </Suspense>
        </FormProvider>
      </div>

      {pendingValues && (
        <SubmitConfirmModal
          message={MODE_TEXT[mode].confirmMessage}
          confirmLabel={MODE_TEXT[mode].confirmLabel}
          isSubmitting={isPending}
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelSubmit}
        />
      )}
    </div>
  );
}

export default function TeamProfileForm({ mode }: TeamProfileFormProps) {
  const token = useTokenState();
  const isEditMode = mode === 'edit';

  // _app.tsx의 QueryClient는 SSR 중 모든 쿼리를 기본적으로 enabled:false로 끈다(전역 기본값).
  // useSuspenseQuery는 enabled를 지원하지 않아 이 기본값을 개별적으로 못 덮어써서 서버에서 빈 데이터로
  // 취급되므로, 여기서는 enabled를 명시할 수 있는 일반 useQuery를 쓴다. edit/index.tsx의
  // getServerSideProps가 이미 이 쿼리를 prefetch+dehydrate해뒀으므로, 서버·클라이언트 모두 첫 렌더부터
  // 캐시에서 동기적으로 값을 읽는다 — "빈 폼으로 시작했다가 나중에 채워지는" 창 자체가 없다.
  const { data: existingProfile } = useQuery({
    ...teamRecruitmentProfileQueries.me(token),
    enabled: isEditMode && !!token,
  });

  return (
    <ProfileFormBody mode={mode} defaultValues={isEditMode ? toDefaultValues(existingProfile ?? null) : EMPTY_DEFAULT_VALUES} />
  );
}
