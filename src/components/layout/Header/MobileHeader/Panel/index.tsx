import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import BlackArrowBackIcon from 'assets/svg/black-arrow-back-icon.svg';
import PersonIcon from 'assets/svg/person.svg';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import { CATEGORY, type Submenu } from 'static/category';
import ROUTES from 'static/routes';
import { IS_STAGE } from 'static/url';
import { useLogout } from 'utils/hooks/auth/useLogout';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { useUser } from 'utils/hooks/state/useUser';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';

import styles from './Panel.module.scss';

interface PanelProps {
  openModal: () => void;
}

export default function Panel({ openModal }: PanelProps) {
  const { isSidebarOpen, closeSidebar } = useMobileSidebar();
  const { data: userInfo } = useUser();
  const router = useRouter();
  const logout = useLogout();

  useEscapeKeyDown({ onEscape: closeSidebar });
  useBodyScrollLock(isSidebarOpen);
  const isLoggedIn = useIsLoggedIn();
  const portalManager = useModalPortal();

  const handleMyInfoClick = () => {
    if (userInfo) {
      closeSidebar();
      openModal();
    } else {
      router.push(ROUTES.Auth());
    }
  };

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal title="쪽지를 사용하기" description="로그인 후 이용해주세요." onClose={portalOption.close} />
    ));
  };

  const handleSubmenuClick = (submenu: Submenu) => {
    if (!isLoggedIn && submenu.title === '쪽지') {
      openLoginModal();

      return;
    }

    if (submenu.title === '주변상점') {
      router.push(`${ROUTES.Store()}?category=1`);
      closeSidebar();

      return;
    }

    if (submenu.openInNewTab) {
      window.open(IS_STAGE && submenu.stageLink ? submenu.stageLink : submenu.link, '_blank');
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
        <button type="button" aria-label="닫기 버튼" className={styles.top__close} onClick={closeSidebar}>
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
        <button className={styles.auth__font} type="button" onClick={() => handleMyInfoClick()}>
          <PersonIcon />내 정보
        </button>
        <button
          className={styles.auth__font}
          type="button"
          onClick={
            userInfo
              ? () => {
                  logout();
                }
              : () => {
                  router.push(ROUTES.Auth());
                }
          }
        >
          {userInfo ? '로그아웃' : '로그인'}
        </button>
      </div>
      <div className={styles.category}>
        {CATEGORY.map((category) => (
          <div key={category.title}>
            <div className={styles.category__title}>{category.title}</div>
            <ul className={styles.category__submenus}>
              {category.submenu.slice(0, -4).map((submenu) => (
                <li key={submenu.title} className={styles.category__submenu}>
                  <button type="button" className={styles.category__button} onClick={() => handleSubmenuClick(submenu)}>
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
