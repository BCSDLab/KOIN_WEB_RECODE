import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import NotificationIcon from 'assets/svg/Team/notification.svg';
import ThreeDotsIcon from 'assets/svg/Team/three-dots.svg';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import DetailInfoSection from 'components/Team/components/DetailInfoSection';
import SubmitConfirmModal from 'components/Team/components/SubmitConfirmModal';
import SubPageHeader from 'components/ui/SubPageHeader';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import ActivityHistoryList from './components/ActivityHistoryList';
import ApplicantActionBar from './components/ApplicantActionBar';
import ApplicantProfileHeader from './components/ApplicantProfileHeader';
import type { TeamRecruitmentApplicationDecision } from 'api/team/entity';
import styles from './ApplicantDetail.module.scss';

interface DecisionModalCopy {
  message: string;
  confirmLabel: string;
  successMessage: string;
  cancelEventSuffix: string;
  confirmEventSuffix: string;
  openEventLabel: string;
}

const DECISION_MODAL_COPY: Record<TeamRecruitmentApplicationDecision, DecisionModalCopy> = {
  ACCEPTED: {
    message: '이 지원자를 승인할까요?',
    confirmLabel: '승인하기',
    successMessage: '지원을 승인했어요.',
    cancelEventSuffix: 'approve_cancel',
    confirmEventSuffix: 'approve_confirm',
    openEventLabel: 'team_recruitment_created_post_applicant_approve',
  },
  REJECTED: {
    message: '이 지원자를 거절할까요?',
    confirmLabel: '거절하기',
    successMessage: '지원을 거절했어요.',
    cancelEventSuffix: 'reject_cancel',
    confirmEventSuffix: 'reject_confirm',
    openEventLabel: 'team_recruitment_created_post_applicant_reject',
  },
};

export default function ApplicantDetail() {
  const router = useRouter();
  const token = useTokenState();
  const logger = useLogger();
  const queryClient = useQueryClient();

  const { postId, applicantId } = router.query;
  const recruitmentId = typeof postId === 'string' ? postId : '';
  const applicationId = typeof applicantId === 'string' ? applicantId : '';

  const { data, isLoading, isError } = useQuery({
    ...teamQueries.applicantDetail(recruitmentId, applicationId, token),
    enabled: !!token && !!recruitmentId && !!applicationId,
  });

  const { mutate: decideApplication, isPending: isDeciding } = useMutation(
    teamMutations.decideApplication(queryClient, token, recruitmentId),
  );

  const [decisionAction, setDecisionAction] = useState<TeamRecruitmentApplicationDecision | null>(null);

  const handleRejectClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: DECISION_MODAL_COPY.REJECTED.openEventLabel,
      value: '거절하기',
    });
    setDecisionAction('REJECTED');
  };

  const handleAcceptClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: DECISION_MODAL_COPY.ACCEPTED.openEventLabel,
      value: '승인하기',
    });
    setDecisionAction('ACCEPTED');
  };

  const handleDecisionCancel = () => {
    if (!decisionAction) return;
    const copy = DECISION_MODAL_COPY[decisionAction];
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: `team_recruitment_created_post_applicant_${copy.cancelEventSuffix}`,
      value: '취소하기',
    });
    setDecisionAction(null);
  };

  const handleDecisionConfirm = () => {
    if (!decisionAction) return;
    const copy = DECISION_MODAL_COPY[decisionAction];

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: `team_recruitment_created_post_applicant_${copy.confirmEventSuffix}`,
      value: copy.confirmLabel,
    });

    decideApplication(
      { applicationId, status: decisionAction },
      {
        onSuccess: () => {
          setDecisionAction(null);
          showToast('success', copy.successMessage);
        },
      },
    );
  };

  return (
    <>
      <SubPageHeader
        title="지원자 상세"
        className={styles.header}
        rightAction={
          <div className={styles.header__actions}>
            <NotificationIcon aria-hidden />
            <ThreeDotsIcon aria-hidden />
          </div>
        }
      />

      <div className={styles.page}>
        <div className={styles.content}>
          {isLoading && <LoadingSpinner size="50px" />}

          {!isLoading && (isError || !data) && <p className={styles.error}>지원자 정보를 불러오지 못했어요.</p>}

          {!isLoading && data && (
            <>
              <ApplicantProfileHeader
                nickname={data.profile_snapshot.nickname}
                status={data.status}
                role={data.role}
                department={data.profile_snapshot.department}
                studentYear={data.profile_snapshot.student_year}
              />

              <h2 className={styles.page__sectionTitle}>기본 정보</h2>

              <div className={styles.skills}>
                <span className={styles.skills__label}>보유기술</span>
                <div className={styles.skills__list}>
                  {data.profile_snapshot.skills.map((skill) => (
                    <span key={skill} className={styles.skills__chip}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <ActivityHistoryList activities={data.profile_snapshot.activities} />

              <DetailInfoSection label="자기소개">
                <p className={styles.text}>{data.profile_snapshot.self_introduction}</p>
              </DetailInfoSection>

              <h2 className={styles.page__sectionTitle}>지원 내용</h2>

              <DetailInfoSection label="지원 동기">
                <p className={styles.text}>{data.motivation}</p>
              </DetailInfoSection>

              <DetailInfoSection label="활동 가능 시간">
                <p className={styles.text}>{data.availability}</p>
              </DetailInfoSection>
            </>
          )}
        </div>

        {data && (
          <ApplicantActionBar
            status={data.status}
            canDecide={data.can_decide}
            canOpenDirectChat={data.can_open_direct_chat}
            isSubmitting={isDeciding}
            onReject={handleRejectClick}
            onAccept={handleAcceptClick}
          />
        )}
      </div>

      {decisionAction && (
        <SubmitConfirmModal
          message={DECISION_MODAL_COPY[decisionAction].message}
          confirmLabel={DECISION_MODAL_COPY[decisionAction].confirmLabel}
          isSubmitting={isDeciding}
          onConfirm={handleDecisionConfirm}
          onCancel={handleDecisionCancel}
        />
      )}
    </>
  );
}
