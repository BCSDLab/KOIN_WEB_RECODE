import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import KebabMenu from 'components/Team/components/KebabMenu';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import showToast from 'utils/ts/showToast';

export default function TeamNotificationMenu() {
  const isLoggedIn = useIsLoggedIn();
  const queryClient = useQueryClient();

  const { data } = useInfiniteQuery({
    ...teamQueries.infiniteNotifications(isLoggedIn),
    enabled: isLoggedIn,
  });
  const { mutate: markAllRead, isPending: isMarkAllReadPending } = useMutation({
    ...teamMutations.markAllNotificationsRead(queryClient),
    onError: () => showToast('error', '알림을 모두 읽음 처리하지 못했어요. 다시 시도해 주세요.'),
  });
  const { mutate: deleteAll, isPending: isDeleteAllPending } = useMutation({
    ...teamMutations.deleteAllNotifications(queryClient),
    onError: () => showToast('error', '알림을 모두 삭제하지 못했어요. 다시 시도해 주세요.'),
  });

  const hasNotifications = data?.pages.some((page) => page.notifications.length > 0) ?? false;

  if (!hasNotifications) return null;

  return (
    <KebabMenu
      triggerAriaLabel="알림 메뉴"
      menuAriaLabel="알림 메뉴"
      items={[
        {
          key: 'mark-all-read',
          label: '모두 읽음으로 표시',
          onClick: () => markAllRead(),
          disabled: isMarkAllReadPending,
        },
        {
          key: 'delete-all',
          label: '알림 전체 삭제',
          onClick: () => deleteAll(),
          disabled: isDeleteAllPending,
          danger: true,
        },
      ]}
    />
  );
}
