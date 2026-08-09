import { useEffect, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { callvanQueries, callvanQueryKeys } from 'api/callvan/queries';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import ThreeDotsIcon from 'assets/svg/Callvan/three-dots.svg';
import DeleteConfirmModal from 'components/Callvan/components/DeleteConfirmModal';
import NotificationCard from 'components/Callvan/components/NotificationCard';
import NotificationDropdown from 'components/Callvan/components/NotificationDropdown';
import NotificationEmptyState from 'components/Callvan/components/NotificationEmptyState';
import useDeleteAllNotifications from 'components/Callvan/hooks/useDeleteAllNotifications';
import useMarkAllNotificationsRead from 'components/Callvan/hooks/useMarkAllNotificationsRead';
import useMarkNotificationRead from 'components/Callvan/hooks/useMarkNotificationRead';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { getDeviceClass } from 'utils/ts/serverRequestContext';
import { withCacheControl } from 'utils/ts/withCacheControl';
import styles from './CallvanNotifications.module.scss';

export const getServerSideProps = withCacheControl<{
  dehydratedState: ReturnType<typeof dehydrate>;
}>(async (context: GetServerSidePropsContext) => {
  // 모바일 전용 화면이다. 데스크톱은 서버에서 바로 돌려보낸다.
  if (getDeviceClass(context.req.headers['user-agent']) !== 'mobile') {
    return { redirect: { destination: ROUTES.Main(), permanent: false } };
  }

  const queryClient = new QueryClient();
  const { token } = parseServerSideParams(context);

  try {
    if (token) {
      await queryClient.prefetchQuery(callvanQueries.notifications(token));
    } else {
      queryClient.setQueryData(callvanQueryKeys.notifications(''), []);
    }
  } catch (error) {
    console.error('[SSR] callvan notifications prefetch failed:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
});

export default function CallvanNotificationsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const mounted = useMount();
  const token = useTokenState();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace(ROUTES.Main());
    }
  }, [mounted, isMobile, router]);

  const { data: notifications } = useQuery({
    ...callvanQueries.notifications(token ?? ''),
    enabled: !!token,
  });
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: deleteAll } = useDeleteAllNotifications({
    onSuccess: () => setIsDeleteModalOpen(false),
  });

  const handleCardClick = (id: number, isRead: boolean) => {
    if (isRead) return;
    markRead(id);
  };

  // 서버 요청 컨텍스트로 토큰이 채워지므로 SSR도 실제 조회 결과를 갖는다.
  // undefined는 아직 조회 전이라는 뜻이라 "알림 없음"과 구분한다.
  const isResolved = notifications !== undefined;
  const hasNotifications = isResolved && notifications.length > 0;

  return (
    <div className={styles['notification-page']}>
      <div className={styles['notification-page__header']}>
        <button
          type="button"
          className={styles['notification-page__back-button']}
          onClick={() => router.back()}
          aria-label="뒤로가기"
        >
          <ArrowBackIcon />
        </button>
        <h1 className={styles['notification-page__title']}>알림</h1>
        {hasNotifications ? (
          <div className={styles['notification-page__menu-wrapper']}>
            <button
              type="button"
              className={styles['notification-page__menu-button']}
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="더보기"
            >
              <ThreeDotsIcon />
            </button>
            {isDropdownOpen && (
              <NotificationDropdown
                onMarkAllRead={() => markAllRead()}
                onDeleteAll={() => setIsDeleteModalOpen(true)}
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
          </div>
        ) : (
          <div className={styles['notification-page__empty-space']} />
        )}
      </div>

      <div className={styles['notification-page__content']}>
        {isResolved
          && (hasNotifications ? (
            <div className={styles['notification-page__list']}>
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <NotificationCard
                    notification={notification}
                    onCardClick={() => handleCardClick(notification.id, notification.is_read)}
                  />
                  {index < notifications.length - 1 && <div className={styles['notification-page__divider']} />}
                </div>
              ))}
            </div>
          ) : (
            <NotificationEmptyState />
          ))}
      </div>

      {isDeleteModalOpen && (
        <DeleteConfirmModal onConfirm={() => deleteAll()} onCancel={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
}

CallvanNotificationsPage.getLayout = (page: React.ReactNode) => <>{page}</>;
