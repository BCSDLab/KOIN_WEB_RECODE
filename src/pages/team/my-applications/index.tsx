import { Suspense, useState } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { teamQueries } from 'api/team/queries';
import EmptyRecruitment from 'assets/svg/common/sleep-bbico.svg';
import ChatIcon from 'assets/svg/Team/chat-bubble.svg';
import FilterIcon from 'assets/svg/Team/filter.svg';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import Layout from 'components/layout';
import MyApplicationFilterPanel from 'components/Team/components/MyApplicationFilterPanel';
import RecruitmentCard from 'components/Team/components/RecruitmentCard';
import useTeamAuthGuard from 'components/Team/hooks/useTeamAuthGuard';
import formatApplicationStatus from 'components/Team/utils/formatApplicationStatus';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';
import type {
  MyTeamRecruitmentApplication,
  MyTeamRecruitmentApplicationListRequest,
  TeamApplicationStatus,
  TeamRecruitmentSort,
} from 'api/team/entity';
import styles from './MyApplicationsPage.module.scss';

const APPLICATION_STATUS_CLASS = {
  PENDING: 'applicationStatus--pending',
  ACCEPTED: 'applicationStatus--accepted',
  REJECTED: 'applicationStatus--rejected',
} as const;

interface ApplicationsListSectionProps {
  requestParams: MyTeamRecruitmentApplicationListRequest;
  onFilterOpen: () => void;
  onChatClick: (application: MyTeamRecruitmentApplication) => React.MouseEventHandler<HTMLButtonElement>;
}

function ApplicationsListSection({ requestParams, onFilterOpen, onChatClick }: ApplicationsListSectionProps) {
  const logger = useLogger();
  const token = useTokenState();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    teamQueries.infiniteMyApplications(token, requestParams),
  );

  const applications = data.pages.flatMap((page) => page.applications);
  const totalCount = data.pages[0]?.total_count ?? 0;

  const scrollTriggerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleFilterOpen = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_applied_post_filter', value: '필터' });
    onFilterOpen();
  };

  return (
    <>
      <div className={styles.summaryRow}>
        <p className={styles.totalCount}>총 {totalCount}개의 모집글</p>

        <button type="button" className={styles.filterButton} onClick={handleFilterOpen}>
          <span className={styles.filterButton__label}>필터</span>
          <FilterIcon />
        </button>
      </div>

      <div className={styles.content}>
        {applications.length === 0 && (
          <div className={styles.empty}>
            <EmptyRecruitment />
            <div className={styles.empty__text}>
              <p className={styles.empty__title}>지원한 모집글이 없어요.</p>
              <p className={styles.empty__subtitle}>마음에 드는 모집글에 지원해보세요.</p>
            </div>
            <Link href={ROUTES.Team()} className={styles.empty__button}>
              모집글 둘러보기
            </Link>
          </div>
        )}

        {applications.length > 0 && (
          <div className={styles.list}>
            {applications.map((application) => (
              <RecruitmentCard
                key={application.application_id}
                recruitment={application.recruitment}
                rightSlot={
                  <span
                    className={cn({
                      [styles.applicationStatus]: true,
                      [styles[APPLICATION_STATUS_CLASS[application.status]]]: true,
                    })}
                  >
                    {formatApplicationStatus(application.status)}
                  </span>
                }
                footerAction={
                  application.team_chat_available &&
                  application.team_chat_room_id !== null && (
                    <button
                      type="button"
                      className={styles.chatButton}
                      aria-label="팀 채팅방으로 이동"
                      onClick={onChatClick(application)}
                    >
                      <ChatIcon />
                    </button>
                  )
                }
              />
            ))}

            <div ref={scrollTriggerRef} className={styles.scrollTrigger} />
          </div>
        )}
      </div>
    </>
  );
}

export default function MyApplicationsPage() {
  const logger = useLogger();
  const router = useRouter();
  const { isAuthReady } = useTeamAuthGuard();

  const [isFilterOpen, openFilter, closeFilter] = useBooleanState(false);
  const [requestParams, setRequestParams] = useState<MyTeamRecruitmentApplicationListRequest>({
    statuses: [],
    sort: 'LATEST_DESC',
  });

  const handleApplyFilter = (filter: { statuses: TeamApplicationStatus[]; sort: TeamRecruitmentSort }) => {
    setRequestParams(filter);
  };

  const handleChatClick =
    (application: MyTeamRecruitmentApplication): React.MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (application.team_chat_room_id === null) return;

      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'team_recruitment_applied_post_chat',
        value: application.recruitment.title,
      });

      router.push(
        ROUTES.TeamChat({
          recruitmentId: String(application.recruitment.id),
          chatRoomId: String(application.team_chat_room_id),
        }),
      );
    };

  // 인증 확인 전 렌더를 막는다: ApplicationsListSection의 useSuspenseInfiniteQuery는 enabled 옵션이 없어
  // 렌더 게이트 외에는 빈 토큰 요청을 막을 방법이 없다.
  // 게이트는 반드시 이 컴포넌트의 모든 훅 호출 뒤에 두어야 훅 개수가 렌더마다 달라지지 않는다.
  if (!isAuthReady) return null;

  return (
    <>
      <Head>
        <title>내가 지원한 모집글 | KOIN</title>
        <meta name="description" content="내가 지원한 팀원 모집 게시글과 지원 상태를 확인할 수 있습니다." />
      </Head>

      <SubPageHeader
        title="내가 지원한 모집글"
        onBack={() => router.replace(ROUTES.TeamProfile())}
        className={styles.header}
      />

      <main className={styles.page}>
        {/* ErrorBoundary에 리셋 경로가 없으므로, 필터가 바뀌면 key로 리마운트해 폴백에 갇히지 않게 한다. */}
        <ErrorBoundary key={JSON.stringify(requestParams)} fallbackClassName={styles.errorFallback}>
          <Suspense fallback={<LoadingSpinner size="50px" />}>
            <ApplicationsListSection
              requestParams={requestParams}
              onFilterOpen={openFilter}
              onChatClick={handleChatClick}
            />
          </Suspense>
        </ErrorBoundary>
      </main>

      {isFilterOpen && (
        <MyApplicationFilterPanel
          isOpen={isFilterOpen}
          onClose={closeFilter}
          statuses={requestParams.statuses ?? []}
          sort={requestParams.sort ?? 'LATEST_DESC'}
          onApply={handleApplyFilter}
        />
      )}
    </>
  );
}

MyApplicationsPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
