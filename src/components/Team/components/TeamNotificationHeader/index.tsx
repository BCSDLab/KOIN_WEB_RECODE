import { useRouter } from 'next/router';

import MobilePageHeader from 'components/layout/MobilePageHeader';
import KebabMenu from 'components/Team/components/KebabMenu';
import PageHeader from 'components/ui/PageHeader';
import ROUTES from 'static/routes';

import styles from './TeamNotificationHeader.module.scss';

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

  const handleBack = () => router.replace(ROUTES.Team());
  const rightAction = showMenu ? menu : undefined;

  return (
    <>
      <MobilePageHeader title="알림" onBack={handleBack} rightAction={rightAction} />
      <div className={styles['desktop-only']}>
        <PageHeader title="알림" onBack={handleBack} rightAction={rightAction} />
      </div>
    </>
  );
}
