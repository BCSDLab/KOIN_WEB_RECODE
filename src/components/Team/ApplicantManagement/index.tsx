import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { useQuery } from '@tanstack/react-query';
import { teamQueries } from 'api/team/queries';
import EmptyRecruitment from 'assets/svg/common/sleep-bbico.svg';
import ChatBubbleIcon from 'assets/svg/Team/chat-bubble.svg';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import RecruitmentCard from 'components/Team/components/RecruitmentCard';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import ApplicantCard from './components/ApplicantCard';
import styles from './ApplicantManagement.module.scss';

export default function ApplicantManagement() {
  const router = useRouter();
  const token = useTokenState();
  const logger = useLogger();
  const { postId } = router.query;
  const recruitmentId = typeof postId === 'string' ? postId : '';

  const { data, isLoading, isError } = useQuery({
    ...teamQueries.applicants(recruitmentId, token),
    enabled: !!token && !!recruitmentId,
  });

  const handleGroupChatClick = () => {
    if (!data || data.recruitment.team_chat_room_id === null) return;

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_group_chat',
      value: data.recruitment.title,
    });
    router.push(ROUTES.TeamChat({ recruitmentId, chatRoomId: String(data.recruitment.team_chat_room_id) }));
  };

  return (
    <>
      <SubPageHeader title="지원자 관리" />

      <div className={styles.page}>
        <div className={styles.content}>
          {isLoading && <LoadingSpinner size="50px" />}

          {!isLoading && (isError || !data) && <p className={styles.error}>지원자 목록을 불러오지 못했어요.</p>}

          {!isLoading && data && (
            <>
              <RecruitmentCard
                recruitment={data.recruitment}
                rightSlot={
                  <span className={styles.recruitmentStatus}>
                    {data.recruitment.status === 'RECRUITING' ? '모집 중' : '모집완료'}
                  </span>
                }
                footerAction={
                  data.recruitment.team_chat_available && (
                    <button type="button" onClick={handleGroupChatClick} aria-label="모집글 그룹 채팅방으로 이동">
                      <ChatBubbleIcon aria-hidden />
                    </button>
                  )
                }
              />

              <div className={cn({ [styles.list]: true, [styles['list--empty']]: data.applications.length === 0 })}>
                <div className={styles.list__header}>
                  <span className={styles.list__title}>지원자 목록</span>
                  <span className={styles.list__count}>총 {data.total_count}명</span>
                </div>

                {data.applications.length === 0 ? (
                  <div className={styles.empty}>
                    <EmptyRecruitment />
                    <p className={styles.empty__title}>아직 지원자가 없어요.</p>
                    <p className={styles.empty__subtitle}>새로운 지원자가 등록되면 이곳에서 확인할 수 있어요.</p>
                  </div>
                ) : (
                  <div className={styles.list__items}>
                    {data.applications.map((applicant) => (
                      <ApplicantCard
                        key={applicant.application_id}
                        applicant={applicant}
                        recruitmentId={recruitmentId}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
