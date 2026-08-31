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
import { CATEGORY_LABEL } from 'components/Team/utils/recruitmentDisplay';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import ActivityHistoryDetailModal from './components/ActivityHistoryDetailModal';
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

  const recruitmentIdNumber = Number(recruitmentId);
  const { data: recruitment } = useQuery({
    ...teamQueries.detail(recruitmentIdNumber, token),
    enabled: !!token && !!recruitmentId,
  });

  const { mutate: decideApplication, isPending: isDeciding } = useMutation(
    teamMutations.decideApplication(queryClient, token, recruitmentId),
  );

  const { mutate: createDirectChatRoom, isPending: isCreatingChat } = useMutation(
    teamMutations.createDirectChatRoom(token, Number(recruitmentId)),
  );

  const [decisionAction, setDecisionAction] = useState<TeamRecruitmentApplicationDecision | null>(null);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

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

  const handleChatClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_applicant_chat',
      value: '채팅',
    });
    createDirectChatRoom(Number(applicationId), {
      onSuccess: (chatRoom) => {
        router.push(ROUTES.TeamChat({ recruitmentId, chatRoomId: String(chatRoom.chat_room_id) }));
      },
    });
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
      <div className={styles.mobileHeader}>
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
      </div>

      <div className={styles.page}>
        <div className={styles.content}>
          {isLoading && <LoadingSpinner size="50px" />}

          {!isLoading && (isError || !data) && <p className={styles.error}>지원자 정보를 불러오지 못했어요.</p>}

          {!isLoading && data && (
            <>
              <div className={styles.desktopTitle}>
                <h1 className={styles.desktopTitle__heading}>지원자 상세</h1>
                {recruitment && (
                  <div className={styles.desktopTitle__context}>
                    <span className={styles.desktopTitle__category}>{CATEGORY_LABEL[recruitment.category]}</span>
                    <span className={styles.desktopTitle__recruitment}>{recruitment.title}</span>
                  </div>
                )}
              </div>

              <ApplicantProfileHeader
                nickname={data.profile_snapshot.nickname}
                status={data.status}
                role={data.role}
                department={data.profile_snapshot.department}
                studentYear={data.profile_snapshot.student_year}
                canOpenDirectChat={data.can_open_direct_chat}
                isChatPending={isCreatingChat}
                onChatClick={handleChatClick}
              />

              <h2 className={styles.page__sectionTitle}>기본 정보</h2>

              <div className={styles.skills}>
                <span className={styles.skills__label}>보유기술 및 자격증</span>
                <div className={styles.skills__list}>
                  {data.profile_snapshot.skills.map((skill) => (
                    <span key={skill} className={styles.skills__chip}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <ActivityHistoryList
                activities={data.profile_snapshot.activities}
                onMoreClick={() => setIsActivityModalOpen(true)}
                className={styles.activitySection}
              />

              <DetailInfoSection label="자기소개" className={styles.selfIntroductionSection}>
                <p className={styles.text}>{data.profile_snapshot.self_introduction}</p>
              </DetailInfoSection>

              <h2 className={styles.page__sectionTitle}>지원 내용</h2>

              <DetailInfoSection label="지원 동기" className={styles.motivationSection}>
                <p className={styles.text}>{data.motivation}</p>
              </DetailInfoSection>

              <DetailInfoSection label="참여 가능 시간" className={styles.availabilitySection}>
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
            isChatPending={isCreatingChat}
            onReject={handleRejectClick}
            onAccept={handleAcceptClick}
            onChatClick={handleChatClick}
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

      {isActivityModalOpen && data && (
        <ActivityHistoryDetailModal
          activities={data.profile_snapshot.activities}
          onClose={() => setIsActivityModalOpen(false)}
        />
      )}
    </>
  );
}
