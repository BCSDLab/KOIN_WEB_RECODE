import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';

import ArrowBackIcon from 'assets/svg/Team/arrow-back.svg';
import ThreeDotsIcon from 'assets/svg/Team/three-dots.svg';
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
  const router = useRouter();
  const [isMenuOpen, openMenu, closeMenu] = useBooleanState(false);

  const handleBack = () => {
    if (window.history.state?.idx === 0) {
      router.push(ROUTES.Team());
      return;
    }

    router.back();
  };

  const handleMarkAllRead = () => {
    onMarkAllRead();
    closeMenu();
  };

  const handleDeleteAll = () => {
    onDeleteAll();
    closeMenu();
  };

  return (
    <header className={styles.header}>
      <button type="button" className={styles['header__icon-button']} aria-label="뒤로가기" onClick={handleBack}>
        <ArrowBackIcon />
      </button>

      <h1 className={styles.header__title}>알림</h1>

      {showMenu && (
        <button
          type="button"
          className={styles['header__icon-button']}
          aria-label="알림 메뉴"
          aria-expanded={isMenuOpen}
          onClick={isMenuOpen ? closeMenu : openMenu}
        >
          <ThreeDotsIcon />
        </button>
      )}

      {showMenu && isMenuOpen && (
        <>
          <button type="button" className={styles.header__overlay} aria-label="메뉴 닫기" onClick={closeMenu} />

          <div className={styles.header__dropdown}>
            <button
              type="button"
              className={styles['header__dropdown-item']}
              disabled={isMarkAllReadPending}
              onClick={handleMarkAllRead}
            >
              모두 읽음으로 표시
            </button>

            <button
              type="button"
              className={cn({
                [styles['header__dropdown-item']]: true,
                [styles['header__dropdown-item--danger']]: true,
              })}
              disabled={isDeleteAllPending}
              onClick={handleDeleteAll}
            >
              알림 전체 삭제
            </button>
          </div>
        </>
      )}
    </header>
  );
}
