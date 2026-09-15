import { useRouter } from 'next/router';

import KebabMenu from 'components/Team/components/KebabMenu';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';

interface TeamNotificationHeaderProps {
  showMenu: boolean;
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
  isMarkAllReadPending: boolean;
  isDeleteAllPending: boolean;
}

export default function TeamNotificationHeader({
  showMenu,
  onMarkAllRead,
  onDeleteAll,
  isMarkAllReadPending,
  isDeleteAllPending,
}: TeamNotificationHeaderProps) {
  const router = useRouter();

  const menu = (
    <KebabMenu
      triggerAriaLabel="알림 메뉴"
      menuAriaLabel="알림 메뉴"
      items={[
        {
          key: 'mark-all-read',
          label: '모두 읽음으로 표시',
          onClick: onMarkAllRead,
          disabled: isMarkAllReadPending,
        },
        {
          key: 'delete-all',
          label: '알림 전체 삭제',
          onClick: onDeleteAll,
          disabled: isDeleteAllPending,
          danger: true,
        },
      ]}
    />
  );

  return (
    <SubPageHeader
      title="알림"
      onBack={() => router.replace(ROUTES.Team())}
      rightAction={showMenu ? menu : undefined}
    />
  );
}
