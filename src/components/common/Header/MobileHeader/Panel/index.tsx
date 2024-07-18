import { cn } from '@bcsdlab/utils';
import { useNavigate } from 'react-router-dom';
import { CATEGORY, Submenu } from 'static/category';
import useLogger from 'utils/hooks/useLogger';
import { useLogout } from 'utils/hooks/useLogout';
import { useUser } from 'utils/hooks/useUser';
import { ReactComponent as BlackArrowBackIcon } from 'assets/svg/black-arrow-back-icon.svg';
import { ReactComponent as PersonIcon } from 'assets/svg/person.svg';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';
import { useEffect } from 'react';
import styles from './Panel.module.scss';

interface PanelProps {
  openModal: () => void,
}

export default function Panel({ openModal }: PanelProps) {
  const { isSidebarOpen, closeSidebar } = useMobileSidebar();
  const { data: userInfo } = useUser();
  const logout = useLogout();
  const logger = useLogger();
  const navigate = useNavigate();

  const logShortcut = (title: string) => {
    if (title === '주변상점') logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'hamburger_shop', value: '주변상점' });
    if (title === '시간표') logger.actionEventClick({ actionTitle: 'USER', title: 'hamburger_timetable', value: '햄버거 시간표' });
  };

  const handleMyInfoClick = () => {
    if (userInfo) {
      closeSidebar();
      openModal();
    } else {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'hamburger_login',
        value: '햄버거 로그인',
      });
      navigate('/auth');
    }
  };

  const handleSubmenuClick = (submenu: Submenu) => {
    logShortcut(submenu.title);
    closeSidebar();
    if (submenu.openInNewTab) {
      window.open(submenu.link, '_blank');
    } else {
      navigate(submenu.link);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.cssText = 'overflow: hidden;';
    } else {
      document.body.style.cssText = '';
    }

    return () => {
      document.body.style.cssText = '';
    };
  }, [isSidebarOpen]);

  return (
    <nav
      className={cn({
        [styles.container]: true,
        [styles['container--expanded']]: isSidebarOpen,
      })}
    >
      <div className={styles.top}>
        <button
          className={styles.top__close}
          type="button"
          aria-label="닫기 버튼"
          onClick={closeSidebar}
        >
          <BlackArrowBackIcon />
        </button>
      </div>
      <div className={styles.greet}>
        {userInfo ? (
          <div className={styles.greet__font}>
            <span className={styles['greet--highlight']}>{userInfo.nickname}</span>
            님, 안녕하세요!
          </div>
        ) : (
          <div className={styles.greet__font}>로그인 후 더 많은 기능을 사용하세요.</div>
        )}
      </div>
      <div className={styles.auth}>
        <button
          className={styles.auth__font}
          type="button"
          onClick={() => handleMyInfoClick()}
        >
          <PersonIcon />
          내 정보
        </button>
        <button
          className={styles.auth__font}
          type="button"
          onClick={userInfo ? logout : () => navigate('/auth')}
        >
          {userInfo ? '로그아웃' : '로그인'}
        </button>
      </div>
      <div className={styles.category}>
        {CATEGORY.map((category) => (
          <div key={category.title}>
            <div className={styles.category__title}>
              {category.title}
            </div>
            <ul className={styles.category__submenus}>
              {category.submenu.map((submenu) => (
                <li key={submenu.title} className={styles.category__submenu}>
                  <button
                    type="button"
                    className={styles.category__button}
                    onClick={() => handleSubmenuClick(submenu)}
                  >
                    {submenu.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
