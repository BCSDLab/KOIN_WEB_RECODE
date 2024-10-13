import { cn } from '@bcsdlab/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORY, Submenu } from 'static/category';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLogout } from 'utils/hooks/auth/useLogout';
import { useUser } from 'utils/hooks/state/useUser';
import { ReactComponent as BlackArrowBackIcon } from 'assets/svg/black-arrow-back-icon.svg';
import { ReactComponent as PersonIcon } from 'assets/svg/person.svg';
import ROUTES from 'static/routes';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import styles from './Panel.module.scss';

interface PanelProps {
  openModal: () => void,
}

export default function Panel({ openModal }: PanelProps) {
  const { isSidebarOpen, closeSidebar } = useMobileSidebar();
  const { data: userInfo } = useUser();
  const { pathname } = useLocation();
  const logout = useLogout();
  const logger = useLogger();
  const navigate = useNavigate();
  useEscapeKeyDown({ onEscape: closeSidebar });
  useBodyScrollLock(isSidebarOpen);
  const isStage = process.env.REACT_APP_API_PATH?.includes('stage');

  const logShortcut = (title: string) => {
    if (title === '식단') logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'hamburger', value: '식단' });
    if (title === '버스/교통') logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'hamburger', value: '버스' });
    if (title === '공지사항') logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'hamburger', value: '공지사항' });
    if (title === '주변상점') logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'hamburger_shop', value: '주변상점' });
    if (title === '복덕방') logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'hamburger', value: '복덕방' });
    if (title === '시간표') logger.actionEventClick({ actionTitle: 'USER', title: 'hamburger', value: '시간표' });
  };

  // 기존 페이지에서 햄버거를 통해 다른 페이지로 이동할 때의 로그입니다.
  const logExitExistingPage = (title: string) => {
    if (pathname === '/timetable') {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'timetable_back',
        value: '햄버거',
        previous_page: '시간표',
        current_page: title,
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
    }
  };

  const handleMyInfoClick = () => {
    if (userInfo) {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'hamburger',
        value: '내정보',
      });
      closeSidebar();
      openModal();
    } else {
      navigate(ROUTES.Auth());
    }
  };

  const handleSubmenuClick = (submenu: Submenu) => {
    logShortcut(submenu.title);
    logExitExistingPage(submenu.title);
    closeSidebar();
    if (submenu.openInNewTab) {
      window.open(isStage && submenu.stageLink ? submenu.stageLink : submenu.link, '_blank');
    } else {
      navigate(submenu.link);
    }
  };

  return (
    <nav
      className={cn({
        [styles.container]: true,
        [styles['container--expanded']]: isSidebarOpen,
      })}
    >
      <div className={styles.top}>
        <button
          type="button"
          aria-label="닫기 버튼"
          className={styles.top__close}
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
          onClick={
            userInfo
              ? () => {
                logout();
                logger.actionEventClick({
                  actionTitle: 'USER',
                  title: 'hamburger',
                  value: '로그아웃',
                });
              }
              : () => {
                navigate(ROUTES.Auth());
                logger.actionEventClick({
                  actionTitle: 'USER',
                  title: 'hamburger',
                  value: '로그인',
                });
              }
          }
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
              {category.submenu.slice(0, -4).map((submenu) => (
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
