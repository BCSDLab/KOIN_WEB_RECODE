import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import {
  teamRecruitmentProfileQueries,
  useUpsertTeamRecruitmentProfileMutation,
} from 'api/teamRecruitmentProfile/queries';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import SubmitConfirmModal from 'components/Team/components/SubmitConfirmModal';
import useTeamAuthGuard from 'components/Team/hooks/useTeamAuthGuard';
import useApplyStep from 'components/Team/RecruitmentApplyPage/hooks/useApplyStep';
import { createApplicationFormSchema } from 'components/Team/RecruitmentApplyPage/schema';
import SubPageHeader from 'components/ui/SubPageHeader';
import { FormProvider, useForm } from 'react-hook-form';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import ApplicationStep from './Steps/ApplicationStep';
import BasicInfoStep from './Steps/BasicInfoStep';
import { APPLY_STEPS, type ApplicationFormValues, type ApplyStepTitle } from './types';
import type { UpsertTeamRecruitmentProfileRequest } from 'api/teamRecruitmentProfile/entity';
import styles from './RecruitmentApplyPage.module.scss';

const LOGGING_TITLE = {
  SUBMIT_CONFIRM: 'team_recruitment_apply_submit_confirm',
  SUBMIT_CANCEL: 'team_recruitment_apply_submit_cancel',
};

const toProfileRequestBody = (
  values: ApplicationFormValues,
  preferredRole: string,
): UpsertTeamRecruitmentProfileRequest => ({
  profile_nickname: values.nickname.trim(),
  preferred_role: preferredRole,
  skills: values.skills.map((skill) => skill.value.trim()).filter((skill) => skill.length > 0),
  activities: values.activities.map((activity) => ({
    title: activity.title.trim(),
    started_at: activity.startDate,
    ended_at: activity.isOngoing ? null : activity.endDate || null,
    is_ongoing: activity.isOngoing,
    description: activity.content.trim(),
  })),
  self_introduction: values.introduction.trim(),
});

export default function RecruitmentApplyPage() {
  const router = useRouter();
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { actionEventClick } = useLogger();
  const { isAuthReady } = useTeamAuthGuard();
  const [pendingValues, setPendingValues] = useState<ApplicationFormValues | null>(null);

  const postId = Array.isArray(router.query.postId) ? router.query.postId[0] : router.query.postId;
  const recruitmentId = Number(postId);
  const isValidRecruitmentId = Number.isInteger(recruitmentId) && recruitmentId > 0;

  const buildStepHref = useCallback(
    (step: ApplyStepTitle) => ROUTES.TeamRecruitmentApply({ postId: String(postId), step }),
    [postId],
  );
  const { currentStep, nextStep, goBack, isReady } = useApplyStep<ApplyStepTitle>(
    APPLY_STEPS,
    '기본 정보',
    buildStepHref,
    String(postId),
  );

  const {
    data: recruitment,
    isLoading: isRecruitmentLoading,
    isError: isRecruitmentError,
  } = useQuery({
    ...teamQueries.detail(recruitmentId, token),
    enabled: router.isReady && isValidRecruitmentId,
  });

  const { data: existingProfile } = useQuery({
    ...teamRecruitmentProfileQueries.me(token),
    enabled: !!token,
  });

  const canApply = !!recruitment && (recruitment.can_apply || recruitment.apply_block_reason === 'PROFILE_REQUIRED');

  const isGeneralRecruitment = !!recruitment && recruitment.roles.length === 0;

  const schema = useMemo(() => createApplicationFormSchema(isGeneralRecruitment), [isGeneralRecruitment]);

  const methods = useForm<ApplicationFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      nickname: '',
      department: '',
      studentNumber: '',
      skills: [],
      activities: [],
      introduction: '',
      roleId: null,
      motivation: '',
      availability: '',
    },
  });

  useEffect(() => {
    if (!existingProfile || methods.formState.isDirty) return;

    methods.reset({
      ...methods.getValues(),
      nickname: existingProfile.profile_nickname,
      department: existingProfile.department,
      studentNumber: existingProfile.student_number,
      skills: existingProfile.skills.map((skill) => ({ value: skill })),
      activities: existingProfile.activities.map((activity) => ({
        id: String(activity.id),
        title: activity.title,
        startDate: activity.started_at,
        endDate: activity.ended_at,
        isOngoing: activity.is_ongoing,
        content: activity.description,
      })),
      introduction: existingProfile.self_introduction,
    });
  }, [existingProfile, methods]);

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

  const { mutate: upsertProfile, isPending: isProfilePending } = useUpsertTeamRecruitmentProfileMutation();
  const { mutate: submitApplication, isPending: isApplicationPending } = useMutation(
    teamMutations.submitApplication(queryClient, token, recruitmentId),
  );
  const isSubmitting = isProfilePending || isApplicationPending;

  const handleRequestSubmit = methods.handleSubmit(
    (values) => setPendingValues(values),
    (errors) => {
      if (errors.nickname || errors.department || errors.studentNumber || errors.activities || errors.introduction) {
        showToast('warning', '기본 정보를 먼저 입력해주세요.');
        goToFirstStep();
        return;
      }
      showToast('warning', '필수 항목을 모두 작성해주세요.');
    },
  );

  const handleConfirmSubmit = () => {
    if (!pendingValues || !recruitment) return;

    let roleId: number | null;
    let preferredRole: string;

    if (isGeneralRecruitment) {
      roleId = null;
      preferredRole = existingProfile?.preferred_role ?? '전체';
    } else {
      const selectedRole = recruitment.roles.find((role) => role.id === pendingValues.roleId);
      if (!selectedRole) {
        showToast('warning', '지원 역할을 다시 선택해주세요.');
        return;
      }
      roleId = selectedRole.id;
      preferredRole = selectedRole.name;
    }

    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.SUBMIT_CONFIRM,
      value: '지원하기',
    });

    upsertProfile(toProfileRequestBody(pendingValues, preferredRole), {
      onSuccess: () => {
        submitApplication(
          {
            role_id: roleId,
            motivation: pendingValues.motivation.trim(),
            availability: pendingValues.availability.trim(),
          },
          {
            onSuccess: () => {
              setPendingValues(null);
              showToast('success', '지원서가 제출되었습니다.');
              router.push(ROUTES.TeamMyApplications());
            },
          },
        );
      },
    });
  };

  const handleCancelSubmit = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: LOGGING_TITLE.SUBMIT_CANCEL,
      value: '취소하기',
    });
    setPendingValues(null);
  };

  if (!isAuthReady) return null;

  return (
    <div className={styles.container}>
      <SubPageHeader title="팀원 모집 지원" />

      {(!router.isReady || isRecruitmentLoading) && <p className={styles.state}>모집글을 불러오는 중입니다.</p>}

      {router.isReady && !recruitment && (!isValidRecruitmentId || isRecruitmentError) && (
        <p className={styles.state}>모집글을 불러오지 못했습니다.</p>
      )}

      {recruitment && !canApply && (
        <div className={styles.blocked}>
          <p className={styles.blocked__message}>지원할 수 없는 모집글이에요.</p>
          <Link className={styles.blocked__link} href={ROUTES.TeamDetail({ postId: String(postId) })}>
            모집글로 돌아가기
          </Link>
        </div>
      )}

      {recruitment && canApply && (
        <FormProvider {...methods}>
          <Suspense fallback={<LoadingSpinner size="50px" />}>
            {currentStep === '기본 정보' ? (
              <BasicInfoStep onNext={() => nextStep('지원서 작성')} />
            ) : (
              <ApplicationStep
                roles={recruitment.roles}
                onBack={goBack}
                onSubmit={handleRequestSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </Suspense>
        </FormProvider>
      )}

      {pendingValues && (
        <SubmitConfirmModal
          message="지원서를 제출하시겠어요?"
          confirmLabel="지원하기"
          isSubmitting={isSubmitting}
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelSubmit}
        />
      )}
    </div>
  );
}
