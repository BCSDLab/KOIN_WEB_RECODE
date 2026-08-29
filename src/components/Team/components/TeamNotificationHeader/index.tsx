import { cn } from '@bcsdlab/utils';

import ThreeDotsIcon from 'assets/svg/Team/three-dots.svg';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useBooleanState from 'utils/hooks/state/useBooleanState';
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
  const [isMenuOpen, openMenu, closeMenu] = useBooleanState(false);

  const handleMarkAllRead = () => {
    onMarkAllRead();
    closeMenu();
  };

  const handleDeleteAll = () => {
    onDeleteAll();
    closeMenu();
  };

  const menu = (
    <>
      <button
        type="button"
        className={styles.menu__button}
        aria-label="알림 메뉴"
        aria-expanded={isMenuOpen}
        onClick={isMenuOpen ? closeMenu : openMenu}
      >
        <ThreeDotsIcon />
      </button>

      {isMenuOpen && (
        <>
          <button type="button" className={styles.menu__overlay} aria-label="메뉴 닫기" onClick={closeMenu} />

          <div className={styles.menu__dropdown}>
            <button
              type="button"
              className={styles.menu__item}
              disabled={isMarkAllReadPending}
              onClick={handleMarkAllRead}
            >
              모두 읽음으로 표시
            </button>

            <button
              type="button"
              className={cn({
                [styles.menu__item]: true,
                [styles['menu__item--danger']]: true,
              })}
              disabled={isDeleteAllPending}
              onClick={handleDeleteAll}
            >
              알림 전체 삭제
            </button>
          </div>
        </>
      )}
    </>
  );

  return <SubPageHeader title="알림" fallbackPath={ROUTES.Team()} rightAction={showMenu ? menu : undefined} />;
}
