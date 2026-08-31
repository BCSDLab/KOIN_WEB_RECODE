import { Suspense, useState } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import EmptyRecruitment from 'assets/svg/common/sleep-bbico.svg';
import ChatIcon from 'assets/svg/Team/chat-bubble.svg';
import FilterIcon from 'assets/svg/Team/filter.svg';
import ErrorBoundary from 'components/boundary/ErrorBoundary';
import LoadingSpinner from 'components/feedback/LoadingSpinner';
import Layout from 'components/layout';
import MyCreatedPostFilterPanel from 'components/Team/components/MyCreatedPostFilterPanel';
import RecruitmentCard from 'components/Team/components/RecruitmentCard';
import SubmitConfirmModal from 'components/Team/components/SubmitConfirmModal';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';
import showToast from 'utils/ts/showToast';
import type {
  MyCreatedTeamRecruitment,
  MyCreatedTeamRecruitmentListRequest,
  TeamRecruitmentSort,
  TeamRecruitmentStatusFilter,
} from 'api/team/entity';
import styles from './MyCreatedPostsPage.module.scss';

interface CreatedPostsListSectionProps {
  requestParams: MyCreatedTeamRecruitmentListRequest;
  onFilterOpen: () => void;
  onApplicantClick: (recruitment: MyCreatedTeamRecruitment) => void;
  onCloseClick: (recruitment: MyCreatedTeamRecruitment) => void;
  onChatClick: (recruitment: MyCreatedTeamRecruitment) => React.MouseEventHandler<HTMLButtonElement>;
}

function CreatedPostsListSection({
  requestParams,
  onFilterOpen,
  onApplicantClick,
  onCloseClick,
  onChatClick,
}: CreatedPostsListSectionProps) {
  const logger = useLogger();
  const token = useTokenState();
  const isMobile = useMediaQuery();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    teamQueries.infiniteMyCreated(token, requestParams),
  );

  const recruitments = data.pages.flatMap((page) => page.recruitments);
  const totalCount = data.pages[0]?.total_count ?? 0;

  const scrollTriggerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleFilterOpen = () => {
    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_created_post_filter', value: '필터' });
    onFilterOpen();
  };

  const handleApplicantClick =
    (recruitment: MyCreatedTeamRecruitment): React.MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onApplicantClick(recruitment);
    };

  const handleCloseClick =
    (recruitment: MyCreatedTeamRecruitment): React.MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onCloseClick(recruitment);
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
        {recruitments.length === 0 && (
          <div className={styles.empty}>
            <EmptyRecruitment />
            <div className={styles.empty__text}>
              <p className={styles.empty__title}>작성한 모집글이 없어요.</p>
              <p className={styles.empty__subtitle}>직접 모집글을 작성하여 팀원을 모집해보세요.</p>
            </div>
            <Link href={ROUTES.TeamRecruitmentNew()} className={styles.empty__button}>
              모집글 작성하기
            </Link>
          </div>
        )}

        {recruitments.length > 0 && (
          <div className={styles.list}>
            {recruitments.map((recruitment) => {
              const canChat = recruitment.team_chat_available && recruitment.team_chat_room_id !== null;
              const chatButton = canChat && (
                <button
                  type="button"
                  className={styles.chatButton}
                  aria-label="팀 채팅방으로 이동"
                  onClick={onChatClick(recruitment)}
                >
                  <ChatIcon />
                </button>
              );

              // 데스크탑은 뱃지와 같은 상단 행에 관리 버튼·채팅 버튼을 함께 배치하고(rightSlot),
              // 모바일은 채팅 버튼만 상단에 두고 관리 버튼은 카드 하단 별도 행(actionSlot)에 배치한다.
              return (
                <RecruitmentCard
                  key={recruitment.id}
                  recruitment={recruitment}
                  rightSlot={
                    isMobile ? (
                      chatButton
                    ) : (
                      <div className={styles.desktopActions}>
                        <button
                          type="button"
                          className={styles.desktopActionButton}
                          onClick={handleApplicantClick(recruitment)}
                        >
                          지원자 관리
                        </button>

                        {recruitment.can_close && (
                          <button
                            type="button"
                            className={styles.desktopActionButton}
                            onClick={handleCloseClick(recruitment)}
                          >
                            모집마감
                          </button>
                        )}

                        {chatButton}
                      </div>
                    )
                  }
                  actionSlot={
                    isMobile && (
                      <>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={handleApplicantClick(recruitment)}
                        >
                          지원자 관리
                        </button>

                        {recruitment.can_close && (
                          <button type="button" className={styles.actionButton} onClick={handleCloseClick(recruitment)}>
                            모집 마감
                          </button>
                        )}
                      </>
                    )
                  }
                />
              );
            })}

            <div ref={scrollTriggerRef} className={styles.scrollTrigger} />
          </div>
        )}
      </div>
    </>
  );
}

export default function MyCreatedPostsPage() {
  const logger = useLogger();
  const router = useRouter();
  const token = useTokenState();
  const mounted = useMount();
  const queryClient = useQueryClient();

  const [isFilterOpen, openFilter, closeFilter] = useBooleanState(false);
  const [requestParams, setRequestParams] = useState<MyCreatedTeamRecruitmentListRequest>({
    status: 'ALL',
    sort: 'LATEST_DESC',
  });
  const [closeTarget, setCloseTarget] = useState<MyCreatedTeamRecruitment | null>(null);

  const { mutate: closeRecruitment, isPending: isClosing } = useMutation(
    teamMutations.closeRecruitment(queryClient, token),
  );

  // 인증 확인 전 렌더를 막는다: useAuthGuard의 리다이렉트는 useEffect에서 일어나므로
  // requireAuth만으로는 첫 렌더에서 CreatedPostsListSection의 API 요청(빈 토큰)을 막지 못한다.
  if (!mounted || !token) return null;

  const handleApplyFilter = (filter: { status: TeamRecruitmentStatusFilter; sort: TeamRecruitmentSort }) => {
    setRequestParams(filter);
  };

  const handleApplicantClick = (recruitment: MyCreatedTeamRecruitment) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_applicant',
      value: recruitment.title,
    });

    // TODO: 지원자 관리 화면 구현 전까지 준비 중 토스트로 대체한다. src/pages/team/notifications/index.tsx의 동일 TODO 참고.
    showToast('warning', '지원자 관리 기능은 준비 중입니다.');
  };

  const handleCloseClick = (recruitment: MyCreatedTeamRecruitment) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_close',
      value: recruitment.title,
    });

    setCloseTarget(recruitment);
  };

  const handleCloseCancel = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_close_cancel',
      value: '취소하기',
    });

    setCloseTarget(null);
  };

  const handleCloseConfirm = () => {
    if (!closeTarget) return;

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_created_post_close_confirm',
      value: '마감하기',
    });

    closeRecruitment(closeTarget.id, { onSuccess: () => setCloseTarget(null) });
  };

  const handleChatClick =
    (recruitment: MyCreatedTeamRecruitment): React.MouseEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (recruitment.team_chat_room_id === null) return;

      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'team_recruitment_created_post_chat',
        value: recruitment.title,
      });

      router.push(
        ROUTES.TeamChat({
          recruitmentId: String(recruitment.id),
          chatRoomId: String(recruitment.team_chat_room_id),
        }),
      );
    };

  return (
    <>
      <Head>
        <title>내가 작성한 모집글 | KOIN</title>
        <meta name="description" content="내가 작성한 팀원 모집 게시글과 지원자 현황을 확인할 수 있습니다." />
      </Head>

      <div className={styles.mobileHeader}>
        <SubPageHeader
          title="내가 작성한 모집글"
          onBack={() => router.replace(ROUTES.TeamProfile())}
          className={styles.header}
        />
      </div>

      <main className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.title}>내가 작성한 모집글</h1>

          <ErrorBoundary key={JSON.stringify(requestParams)} fallbackClassName={styles.errorFallback}>
            <Suspense fallback={<LoadingSpinner size="50px" />}>
              <CreatedPostsListSection
                requestParams={requestParams}
                onFilterOpen={openFilter}
                onApplicantClick={handleApplicantClick}
                onCloseClick={handleCloseClick}
                onChatClick={handleChatClick}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>

      {isFilterOpen && (
        <MyCreatedPostFilterPanel
          isOpen={isFilterOpen}
          onClose={closeFilter}
          status={requestParams.status ?? 'ALL'}
          sort={requestParams.sort ?? 'LATEST_DESC'}
          onApply={handleApplyFilter}
        />
      )}

      {closeTarget && (
        <SubmitConfirmModal
          message="해당 모집글을 마감하시겠어요?"
          description="마감 후에는 더 이상 지원자를 받을 수 없습니다."
          confirmLabel="마감하기"
          isSubmitting={isClosing}
          onConfirm={handleCloseConfirm}
          onCancel={handleCloseCancel}
        />
      )}
    </>
  );
}

MyCreatedPostsPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
MyCreatedPostsPage.requireAuth = true;
