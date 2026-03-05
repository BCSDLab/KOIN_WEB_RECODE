import { useCallback, useEffect, useState } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getCallvanNotifications } from 'api/callvan';
import ArrowBackIcon from 'assets/svg/Callvan/arrow-back.svg';
import ThreeDotsIcon from 'assets/svg/Callvan/three-dots.svg';
import DeleteConfirmModal from 'components/Callvan/components/DeleteConfirmModal';
import NotificationCard from 'components/Callvan/components/NotificationCard';
import NotificationDropdown from 'components/Callvan/components/NotificationDropdown';
import NotificationEmptyState from 'components/Callvan/components/NotificationEmptyState';
import useCallvanNotifications, {
  CALLVAN_NOTIFICATIONS_QUERY_KEY,
} from 'components/Callvan/hooks/useCallvanNotifications';
import useDeleteAllNotifications from 'components/Callvan/hooks/useDeleteAllNotifications';
import useMarkAllNotificationsRead from 'components/Callvan/hooks/useMarkAllNotificationsRead';
import useMarkNotificationRead from 'components/Callvan/hooks/useMarkNotificationRead';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import styles from './CallvanNotifications.module.scss';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token } = parseServerSideParams(context);

  try {
    if (token) {
      await queryClient.prefetchQuery({
        queryKey: [...CALLVAN_NOTIFICATIONS_QUERY_KEY],
        queryFn: () => getCallvanNotifications(token),
      });
    } else {
      queryClient.setQueryData([...CALLVAN_NOTIFICATIONS_QUERY_KEY], []);
    }
  } catch (error) {
    console.error('[SSR] callvan notifications prefetch failed:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default function CallvanNotificationsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const mounted = useMount();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace(ROUTES.Main());
    }
  }, [mounted, isMobile, router]);

  const { data: notifications } = useCallvanNotifications();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: deleteAll } = useDeleteAllNotifications({
    onSuccess: () => setIsDeleteModalOpen(false),
  });

  const handleCardClick = useCallback(
    (id: number) => {
      markRead(id);
    },
    [markRead],
  );

  if (mounted && !isMobile) {
    return null;
  }

  const hasNotifications = notifications && notifications.length > 0;

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
        {!hasNotifications ? (
          <NotificationEmptyState />
        ) : (
          <div className={styles['notification-page__list']}>
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <NotificationCard notification={notification} onCardClick={handleCardClick} />
                {index < notifications.length - 1 && <div className={styles['notification-page__divider']} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <DeleteConfirmModal onConfirm={() => deleteAll()} onCancel={() => setIsDeleteModalOpen(false)} />
      )}
    </div>
  );
}

CallvanNotificationsPage.getLayout = (page: React.ReactNode) => <>{page}</>;
