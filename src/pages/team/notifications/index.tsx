import { useRef } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import EmptyRecruitment from 'assets/svg/common/sleep-bbico.svg';
import Layout from 'components/layout';
import NotificationCard from 'components/Team/components/NotificationCard';
import TeamNotificationHeader from 'components/Team/components/TeamNotificationHeader';
import getNotificationTitle from 'components/Team/utils/getNotificationTitle';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';
import showToast from 'utils/ts/showToast';
import type { TeamRecruitmentNotification } from 'api/team/entity';
import styles from './TeamNotificationsPage.module.scss';

export default function TeamNotificationsPage() {
  const token = useTokenState();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMounted = useMount();
  const logger = useLogger();
  const now = isMounted ? new Date() : null;
  const pendingNotificationIdsRef = useRef(new Set<number>());

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...teamQueries.infiniteNotifications(token ?? ''),
    enabled: !!token,
  });

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];

  const scrollTriggerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const { mutate: markRead } = useMutation({
    ...teamMutations.markNotificationRead(queryClient, token ?? ''),
    onMutate: (notificationId) => {
      pendingNotificationIdsRef.current.add(notificationId);
    },
    onError: () => showToast('error', '알림을 읽음 처리하지 못했어요. 다시 시도해 주세요.'),
    onSettled: (_data, _error, notificationId) => {
      pendingNotificationIdsRef.current.delete(notificationId);
    },
  });
  const { mutate: markAllRead, isPending: isMarkAllReadPending } = useMutation({
    ...teamMutations.markAllNotificationsRead(queryClient, token ?? ''),
    onError: () => showToast('error', '알림을 모두 읽음 처리하지 못했어요. 다시 시도해 주세요.'),
  });
  const { mutate: deleteAllNotifications, isPending: isDeleteAllPending } = useMutation({
    ...teamMutations.deleteAllNotifications(queryClient, token ?? ''),
    onError: () => showToast('error', '알림을 모두 삭제하지 못했어요. 다시 시도해 주세요.'),
  });

  const handleNotificationClick = (notification: TeamRecruitmentNotification) => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'notification_list',
      value: getNotificationTitle(notification),
    });

    if (!notification.is_read && !pendingNotificationIdsRef.current.has(notification.id)) {
      markRead(notification.id);
    }

    if (
      notification.target_type === 'CHAT_ROOM' &&
      notification.recruitment_id !== null &&
      notification.chat_room_id !== null
    ) {
      router.push(
        ROUTES.TeamChat({
          recruitmentId: String(notification.recruitment_id),
          chatRoomId: String(notification.chat_room_id),
        }),
      );
      return;
    }

    if (notification.target_type === 'MY_APPLICATIONS') {
      router.push(ROUTES.TeamMyApplications());
      return;
    }

    if (notification.target_type === 'APPLICANT_MANAGEMENT' && notification.recruitment_id !== null) {
      router.push(ROUTES.TeamRecruitmentApplicants({ postId: String(notification.recruitment_id) }));
    }
  };

  return (
    <>
      <Head>
        <title>팀원 모집 알림 | KOIN</title>
      </Head>

      <TeamNotificationHeader
        showMenu={notifications.length > 0}
        onMarkAllRead={markAllRead}
        onDeleteAll={deleteAllNotifications}
        isMarkAllReadPending={isMarkAllReadPending}
        isDeleteAllPending={isDeleteAllPending}
      />

      <main className={styles.page}>
        {isLoading && <p className={styles.loading}>알림을 불러오는 중입니다.</p>}

        {!isLoading && (isError || notifications.length === 0) && (
          <div className={styles.empty}>
            <EmptyRecruitment />

            <div>
              <p className={styles.empty__title}>{isError ? '알림을 불러오지 못했어요' : '아직 알림이 없어요'}</p>

              {!isError && <p className={styles.empty__subtitle}>팀원 모집 관련 알림이 오면 여기에 표시돼요</p>}
            </div>
          </div>
        )}

        {!isLoading && !isError && notifications.length > 0 && (
          <>
            <div className={styles.list}>
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  now={now}
                  onNotificationClick={handleNotificationClick}
                />
              ))}

              {isFetchingNextPage && <p className={styles.loading}>알림을 불러오는 중입니다.</p>}

              <div ref={scrollTriggerRef} className={styles.scrollTrigger} />
            </div>

            <p className={styles.footnote}>14일이 지난 알림은 자동으로 삭제됩니다.</p>
          </>
        )}
      </main>
    </>
  );
}

TeamNotificationsPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
