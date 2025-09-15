import { cn } from '@bcsdlab/utils';
import { CATEGORY, Submenu } from 'static/category';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLogout } from 'utils/hooks/auth/useLogout';
import { useUser } from 'utils/hooks/state/useUser';
import BlackArrowBackIcon from 'assets/svg/black-arrow-back-icon.svg';
import PersonIcon from 'assets/svg/person.svg';
import ROUTES from 'static/routes';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useRouter } from 'next/router';
import styles from './Panel.module.scss';

interface PanelProps {
  openModal: () => void,
}

export default function Panel({ openModal }: PanelProps) {
  const { isSidebarOpen, closeSidebar } = useMobileSidebar();
  const { data: userInfo } = useUser();
  const router = useRouter();
  const { pathname } = router;
  const logout = useLogout();
  const logger = useLogger();

  useEscapeKeyDown({ onEscape: closeSidebar });
  useBodyScrollLock(isSidebarOpen);
  const token = useTokenState();
  const portalManager = useModalPortal();
  const isStage = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');

  const logShortcut = (title: string) => {
    if (title === '공지사항') logger.actionEventClick({ team: 'CAMPUS', event_label: 'hamburger', value: '공지사항' });
    if (title === '버스 교통편') logger.actionEventClick({ team: 'CAMPUS', event_label: 'hamburger', value: '교통편 조회하기' });
    if (title === '버스 시간표') logger.actionEventClick({ team: 'CAMPUS', event_label: 'hamburger', value: '버스 시간표' });
    if (title === '식단') logger.actionEventClick({ team: 'CAMPUS', event_label: 'hamburger', value: '식단' });
    if (title === '시간표') logger.actionEventClick({ team: 'USER', event_label: 'hamburger', value: '시간표' });
    if (title === '복덕방') logger.actionEventClick({ team: 'BUSINESS', event_label: 'hamburger', value: '복덕방' });
    if (title === '주변상점') logger.actionEventClick({ team: 'BUSINESS', event_label: 'hamburger_shop', value: '주변상점' });
    if (title === '교내 시설물 정보') logger.actionEventClick({ team: 'CAMPUS', event_label: 'hamburger', value: '교내 시설물 정보' });
    if (title === '쪽지') logger.actionEventClick({ team: 'CAMPUS', event_label: 'hamburger', value: '쪽지' });
    if (title === '동아리') logger.actionEventClick({ team: 'CAMPUS', event_label: 'hamburger', value: '동아리' });
  };

  // 기존 페이지에서 햄버거를 통해 다른 페이지로 이동할 때의 로그입니다.
  const logExitExistingPage = (title: string) => {
    if (pathname === '/timetable') {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'timetable_back',
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
        team: 'USER',
        event_label: 'hamburger',
        value: '내정보',
      });
      closeSidebar();
      openModal();
    } else {
      router.push(ROUTES.Auth());
    }
  };

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal
        title="쪽지를 사용하기"
        description="로그인 후 이용해주세요."
        onClose={portalOption.close}
      />
    ));
  };

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal
        title="쪽지를 사용하기"
        description="로그인 후 이용해주세요."
        onClose={portalOption.close}
      />
    ));
  };

  const handleSubmenuClick = (submenu: Submenu) => {
    logShortcut(submenu.title);
    logExitExistingPage(submenu.title);
    if (submenu.openInNewTab) {
      window.open(isStage && submenu.stageLink ? submenu.stageLink : submenu.link, '_blank');
    } else if (!token && submenu.title === '쪽지') {
      openLoginModal();
      return;
    } else {
      router.push(submenu.link);
    }
    closeSidebar();
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
            <span
              className={cn({
                [styles['greet--highlight']]: !!(userInfo.nickname || userInfo.name),
              })}
            >
              {userInfo.nickname ?? userInfo.name ?? '회원'}
            </span>
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
                  team: 'USER',
                  event_label: 'hamburger',
                  value: '로그아웃',
                });
              }
              : () => {
                router.push(ROUTES.Auth());
                logger.actionEventClick({
                  team: 'USER',
                  event_label: 'hamburger',
                  value: '로그인 시도',
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
