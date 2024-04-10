import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CATEGORY, { Category, SubMenu } from 'static/category';
import useBooleanState from 'utils/hooks/useBooleanState';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import useTokenState from 'utils/hooks/useTokenState';
import { useLogout } from 'utils/hooks/useLogout';

import { useUser } from 'utils/hooks/useUser';
import styles from './Header.module.scss';

const ID: { [key: string]: string; } = {
  PANEL: 'megamenu-panel',
  LABEL1: 'megamenu-label-1',
  LABEL2: 'megamenu-label-2',
};

const useMegaMenu = (category: Category[]) => {
  const [panelMenuList, setPanelMenuList] = useState<SubMenu[] | null>();
  const [isExpanded, setIsExpanded] = useState(false);

  const createOnChangeMenu = (title: string) => () => {
    const selectedSubMenu = category
      .find((categoryInfo) => categoryInfo.title === title)?.submenu ?? null;
    setPanelMenuList(selectedSubMenu);
    setIsExpanded(true);
  };
  const onFocusPanel = () => {
    setIsExpanded(true);
  };
  const hideMegaMenu = (
    event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>,
  ) => {
    if (event.type === 'mouseout') {
      const { currentTarget } = event;
      currentTarget.blur();
    }
    setIsExpanded(false);
  };

  return {
    panelMenuList,
    isExpanded,
    createOnChangeMenu,
    onFocusPanel,
    hideMegaMenu,
  };
};

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

function Header() {
  const { pathname } = useLocation();
  const {
    panelMenuList,
    isExpanded: isMegaMenuExpanded,
    createOnChangeMenu,
    onFocusPanel,
    hideMegaMenu,
  } = useMegaMenu(CATEGORY);
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

  return (
    <header
      className={cn({
        [styles.header]: true,
        [styles['header--main']]: isMain,
      })}
    >
      <nav className={styles.header__content}>
        {isMobile ? (
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
                  onClick={() => navigate(-1)}
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
                onClick={expandSidebar}
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
                            <Link to="/auth/modifyinfo">
                              정보 수정
                            </Link>
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
                            <Link to="/auth/signup">
                              회원가입
                            </Link>
                          </li>
                          |
                          <li className={styles.mobileheader__link}>
                            <Link to="/auth">
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
                              <Link to={subMenu.link}>
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
        ) : (
          <>
            <Link
              className={styles.header__logo}
              to="/"
              tabIndex={0}
            >
              <img src="https://static.koreatech.in/assets/img/logo_white.png" alt="KOIN service logo" />
            </Link>
            <div
              className={cn({
                [styles['header__mega-menu']]: true,
                [styles.megamenu]: true,
              })}
              onBlur={hideMegaMenu}
              onMouseOut={hideMegaMenu}
            >
              <ul className={styles['megamenu__trigger-list']}>
                {CATEGORY.map((category, index) => (
                  <li
                    key={category.title}
                  >
                    <button
                      className={styles.megamenu__trigger}
                      tabIndex={0}
                      type="button"
                      onClick={createOnChangeMenu(category.title)}
                      onFocus={createOnChangeMenu(category.title)}
                      onBlur={hideMegaMenu}
                      onMouseOver={createOnChangeMenu(category.title)}
                      onMouseOut={hideMegaMenu}
                      aria-expanded={isMegaMenuExpanded}
                      aria-controls={ID[`LABEL${index + 1}`]}
                    >
                      <span>
                        {category.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <div
                id={ID.PANEL}
                className={styles.megamenu__panel}
                onFocus={onFocusPanel}
                onMouseOver={onFocusPanel}
                aria-hidden={!isMegaMenuExpanded}
                aria-labelledby={Array.from({ length: 2 }, (_, index) => ID[`LABEL${index + 1}`]).join(' ')}
              >
                <ul className={styles.megamenu__content}>
                  {panelMenuList?.map((menu) => (
                    <li className={styles.megamenu__menu} key={menu.title}>
                      {/* TODO: 키보드 Focus 접근성 향상 */}
                      <Link className={styles.megamenu__link} to={menu.link}>
                        {menu.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ul className={styles['header__auth-menu']}>
              {!isLoggedin ? (
                <>
                  <li className={styles['header__auth-link']}>
                    <Link to="/auth/signup">
                      회원가입
                    </Link>
                  </li>
                  <li className={styles['header__auth-link']}>
                    <Link to="/auth">
                      로그인
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className={styles['header__auth-link']}>
                    <Link to="/auth/modifyinfo">
                      정보수정
                    </Link>
                  </li>
                  <li className={styles['header__auth-link']}>
                    <button onClick={logout} type="button" className={styles['header__auth-button']}>
                      로그아웃
                    </button>
                  </li>
                </>
              )}
            </ul>
          </>
        )}

      </nav>
    </header>
  );
}

export default Header;
