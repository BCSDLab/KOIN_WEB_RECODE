import { cn } from '@bcsdlab/utils';
import { useEffect } from 'react';
import {
  Link, useLocation, useNavigate, useParams,
} from 'react-router-dom';
import { CATEGORY } from 'static/category';
import useBooleanState from 'utils/hooks/useBooleanState';
import useLogger from 'utils/hooks/useLogger';
import { useLogout } from 'utils/hooks/useLogout';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import useTokenState from 'utils/hooks/useTokenState';
import { useUser } from 'utils/hooks/useUser';
import * as api from 'api';
import { createPortal } from 'react-dom';
import styles from './MobileHeader.module.scss';

const useMobileSidebar = (pathname: string, isMobile: boolean) => {
  const [isExpanded, expandSidebar, hideSidebar] = useBooleanState(false);

  useEffect(() => {
    if (!isMobile) {
      hideSidebar();
    }
  }, [hideSidebar, isMobile]);

  useEffect(() => {
    hideSidebar();
  }, [hideSidebar, pathname]);

  return {
    isExpanded,
    expandSidebar,
    hideSidebar,
  };
};

export default function MobileHeader() {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery();
  const {
    isExpanded: isMobileSidebarExpanded,
    expandSidebar,
    hideSidebar,
  } = useMobileSidebar(pathname, isMobile);
  const token = useTokenState();
  const isLoggedin = !!token;
  const isMain = pathname === '/';
  const { data: userInfo } = useUser();
  const logout = useLogout();
  const navigate = useNavigate();
  const logger = useLogger();
  const params = useParams();

  const backInDetailPage = async () => {
    if (pathname.includes('/store/') && params) {
      const response = await api.store.getStoreDetailInfo(params.id!);
      logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'shop_back_button', value: response.name }); // 상점 내 뒤로가기 버튼 로깅
    }
  };
  const [, openModal] = useBooleanState(false);

  const loggingBusinessShortCut = (title: string) => {
    if (title === '주변상점') logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'hamburger_shop', value: title });
    if (title === '시간표') logger.actionEventClick({ actionTitle: 'USER', title: 'hamburger_timetable', value: `햄버거 ${title}` });
  };

  const handleHamburgerClick = () => {
    expandSidebar();
    logger.actionEventClick({
      actionTitle: 'USER',
      title: 'hamburger',
      value: '햄버거',
    });
  };

  const openMobileAuthenticateUserModal = () => {
    hideSidebar();
    openModal();
  };

  return (
    <>
      <div
        className={styles.mobileheader}
      >
        {!isMain && (
          <button
            className={cn({
              [styles['mobileheader__icon--left']]: true,
              [styles.mobileheader__icon]: true,
            })}
            type="button"
            onClick={() => {
              backInDetailPage();
              navigate(-1);
            }}
          >
            <img src="https://static.koreatech.in/assets/img/back-menu.png" alt="go back logo" />
          </button>
        )}
        <span className={styles.mobileheader__title}>
          {isMain ? (
            <img src="https://static.koreatech.in/assets/img/logo_white.png" alt="KOIN service logo" />
          ) : (CATEGORY
            .flatMap((categoryValue) => categoryValue.submenu)
            .find((subMenuValue) => subMenuValue.link === pathname)
            ?.title ?? ''
          )}
        </span>
        <button
          className={cn({
            [styles['mobileheader__icon--right']]: true,
            [styles.mobileheader__icon]: true,
          })}
          type="button"
          onClick={handleHamburgerClick}
          aria-expanded={isMobileSidebarExpanded}
        >
          <img src="https://static.koreatech.in/assets/img/menu.png" alt="menu expand logo" />
        </button>
      </div>
      {createPortal(
        (
          <nav className={cn({
            [styles.mobileheader__panel]: true,
            [styles['mobileheader__panel--show']]: isMobileSidebarExpanded,
            [styles['mobileheader__panel--logged-in']]: isLoggedin,
          })}
          >
            <div className={styles.mobileheader__user}>
              <button
                className={styles.mobileheader__backspace}
                type="button"
                onClick={hideSidebar}
              >
                <img src="http://static.koreatech.in/assets/img/arrow_left.png" alt="go back" />
              </button>
              <div className={styles.mobileheader__greet}>
                {isLoggedin ? (
                  <>
                    {userInfo?.nickname}
                    <span>님, 안녕하세요!</span>
                  </>
                ) : (
                  <>
                    로그인
                    <span>을 해주세요!</span>
                  </>
                )}
              </div>
              <ul className={styles['mobileheader__auth-menu']}>
                {isLoggedin ? (
                  <>
                    <li className={styles['mobileheader__my-info']}>
                      <button type="button" onClick={openMobileAuthenticateUserModal} className={styles['mobileheader__my-info-button']}>
                        정보 수정
                      </button>
                    </li>
                    <li className={styles.mobileheader__link}>
                      <button type="button" onClick={logout}>
                        로그아웃
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className={styles.mobileheader__link}>
                      <Link
                        to="/auth/signup"
                        onClick={() => {
                          logger.actionEventClick({
                            actionTitle: 'USER',
                            title: 'hamburger_sign_up',
                            value: '햄버거 회원가입',
                          });
                        }}
                      >
                        회원가입
                      </Link>
                    </li>
                    |
                    <li className={styles.mobileheader__link}>
                      <Link
                        to="/auth"
                        onClick={() => {
                          logger.actionEventClick({
                            actionTitle: 'USER',
                            title: 'hamburger_login',
                            value: '햄버거 로그인',
                          });
                        }}
                      >
                        로그인
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            {CATEGORY.map((categoryInfo) => (
              <div key={categoryInfo.title}>
                <div>
                  <div className={styles['mobileheader__category-title']}>
                    {categoryInfo.title}
                  </div>
                  <ul className={styles['mobileheader__sub-menus']}>
                    {categoryInfo.submenu.map((subMenu) => (
                      <li
                        className={styles['mobileheader__sub-menu']}
                        key={subMenu.title}
                      >
                        <Link
                          to={subMenu.link}
                          target={subMenu.openInNewTab ? '_blank' : '_self'}
                          onClick={() => loggingBusinessShortCut(subMenu.title)}
                        >
                          {subMenu.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
            <img
              className={cn({
                [styles.mobileheader__logo]: true,
                [styles['mobileheader__logo--bcsd']]: true,
              })}
              src="https://image.bcsdlab.com/favicon.ico"
              alt="bcsd lab logo"
            />
            <img
              className={cn({
                [styles.mobileheader__logo]: true,
                [styles['mobileheader__logo--koin']]: true,
              })}
              src="http://static.koreatech.in/assets/img/rectangle_icon.png"
              alt="KOIN service logo"
            />
          </nav>
        ),
        document.body,
      )}
    </>
  );
}
