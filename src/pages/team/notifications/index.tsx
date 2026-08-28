import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import EmptyRecruitment from 'assets/svg/Team/empty-recruitment.svg';
import Layout from 'components/layout';
import NotificationCard from 'components/Team/components/NotificationCard';
import TeamNotificationHeader from 'components/Team/components/TeamNotificationHeader';
import ROUTES from 'static/routes';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import type { TeamRecruitmentNotification } from 'api/team/entity';

import styles from './TeamNotificationsPage.module.scss';

export default function TeamNotificationsPage() {
  const token = useTokenState();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isMounted = useMount();
  const now = isMounted ? new Date() : null;

  const { data, isLoading, isError } = useQuery({ ...teamQueries.notifications(token ?? ''), enabled: !!token });
  const notifications = data?.notifications ?? [];

  const { mutate: markRead } = useMutation(teamMutations.markNotificationRead(queryClient, token ?? ''));
  const { mutate: markAllRead } = useMutation(teamMutations.markAllNotificationsRead(queryClient, token ?? ''));

  const handleNotificationClick = (notification: TeamRecruitmentNotification) => {
    if (!notification.is_read) {
      markRead(notification.id);
    }

    // 지원자 관리
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
    }
  };

  return (
    <>
      <Head>
        <title>팀원 모집 알림 | KOIN</title>
      </Head>

      <TeamNotificationHeader showMenu={notifications.length > 0} onMarkAllRead={markAllRead} />

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
                  onClick={handleNotificationClick}
                />
              ))}
            </div>

            <p className={styles.footnote}>14일이 지난 알림은 자동으로 삭제됩니다.</p>
          </>
        )}
      </main>
    </>
  );
}

TeamNotificationsPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
