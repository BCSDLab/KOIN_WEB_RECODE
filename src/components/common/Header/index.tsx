import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import CATEGORY, { ICategory, ISubMenu } from 'static/category';
import useBoolean from 'utils/hooks/useBoolean';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import cn from 'utils/ts/classnames';
import styles from './Header.module.scss';

const ID: { [key: string]: string; } = {
  PANEL: 'megamenu-panel',
  LABEL1: 'megamenu-label-1',
  LABEL2: 'megamenu-label-2',
};

const useMegaMenu = (category: ICategory[]) => {
  const [panelMenuList, setPanelMenuList] = useState<ISubMenu[] | null>();
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
  const onBlurMegaMenu = () => {
    setIsExpanded(false);
  };

  return {
    panelMenuList,
    isExpanded,
    createOnChangeMenu,
    onFocusPanel,
    onBlurMegaMenu,
  };
};

const useMobileSidebar = (pathname: string, isMobile: boolean) => {
  const [isExpanded, expandSidebar, hideSidebar] = useBoolean(false);

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
    onBlurMegaMenu,
  } = useMegaMenu(CATEGORY);
  const isMobile = useMediaQuery();
  const {
    isExpanded: isMobileSidebarExpanded,
    expandSidebar,
    hideSidebar,
  } = useMobileSidebar(pathname, isMobile);
  // TODO: Auth 모듈이 만들어지면 그 때 변경
  const [token] = useState(false);
  const isLoggedin = !!token;
  const [userInfo] = useState<{ nickname: string; } | null>(null);

  const isMain = true; // pathname === '/';

  return (
    <header
      className={cn({
        [styles.Header]: true,
        [styles['Header--main']]: isMain,
      })}
    >
      <nav className={styles.Header__content}>
        {isMobile ? (
          <>
            <div
              className={styles.MobileHeader}
            >
              {!isMain && (
                <button
                  className={cn({
                    [styles['MobileHeader__icon--left']]: true,
                    [styles.MobileHeader__icon]: true,
                  })}
                  type="button"
                >
                  <img src="https://static.koreatech.in/assets/img/back-menu.png" alt="go back logo" />
                </button>
              )}
              <span className={styles.MobileHeader__title}>
                {isMain ? (
                  <img src="https://static.koreatech.in/assets/img/logo_white.png" alt="KOIN service logo" />
                ) : (CATEGORY
                  .map((categoryValue) => categoryValue.submenu)
                  .flat()
                  .find((subMenuValue) => subMenuValue.link === pathname)
                  ?.title ?? ''
                )}
              </span>
              <button
                className={cn({
                  [styles['MobileHeader__icon--right']]: true,
                  [styles.MobileHeader__icon]: true,
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
                  [styles.MobileHeader__panel]: true,
                  [styles['MobileHeader__panel--show']]: isMobileSidebarExpanded,
                  [styles['MobileHeader__panel--logged-in']]: isLoggedin,
                })}
                >
                  <div className={styles.MobileHeader__user}>
                    <button
                      className={styles.MobileHeader__backspace}
                      type="button"
                      onClick={hideSidebar}
                    >
                      <img src="http://static.koreatech.in/assets/img/arrow_left.png" alt="go back" />
                    </button>
                    <div className={styles.MobileHeader__greet}>
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
                    <ul className={styles['MobileHeader__auth-menu']}>
                      {isLoggedin ? (
                        <>
                          <li
                            className={styles['MobileHeader__my-info']}
                          >
                            <Link
                              to="/modifyinfo"
                            >
                              내 정보
                            </Link>
                          </li>
                          <li className={styles.MobileHeader__link}>
                            <button
                              type="button"
                            >
                              로그아웃
                            </button>
                          </li>
                        </>
                      ) : (
                        <>
                          <li
                            className={styles.MobileHeader__link}
                          >
                            <Link
                              to="/signup"
                            >
                              회원가입
                            </Link>
                          </li>
                          |
                          <li
                            className={styles.MobileHeader__link}
                          >
                            <Link
                              to="/login"
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
                        <div className={styles['MobileHeader__category-title']}>
                          {categoryInfo.title}
                        </div>
                        <ul className={styles['MobileHeader__sub-menus']}>
                          {categoryInfo.submenu.map((subMenu) => (
                            <li
                              className={styles['MobileHeader__sub-menu']}
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
                      [styles.MobileHeader__logo]: true,
                      [styles['MobileHeader__logo--bcsd']]: true,
                    })}
                    src="http://static.koreatech.in/assets/img/ic-bcsd_gray.png"
                    alt="bcsd lab logo"
                  />
                  <img
                    className={cn({
                      [styles.MobileHeader__logo]: true,
                      [styles['MobileHeader__logo--koin']]: true,
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
              className={styles.Header__logo}
              to="/"
              tabIndex={0}
            >
              <img src="https://static.koreatech.in/assets/img/logo_white.png" alt="KOIN service logo" />
            </Link>
            <div
              className={cn({
                [styles['Header__mega-menu']]: true,
                [styles.MegaMenu]: true,
              })}
              onBlur={onBlurMegaMenu}
              onMouseOut={onBlurMegaMenu}
            >
              <ul className={styles['MegaMenu__trigger-list']}>
                {CATEGORY.map((category, index) => (
                  <li
                    key={category.title}
                  >
                    <button
                      className={styles.MegaMenu__trigger}
                      tabIndex={0}
                      type="button"
                      onClick={createOnChangeMenu(category.title)}
                      onFocus={createOnChangeMenu(category.title)}
                      onMouseOver={createOnChangeMenu(category.title)}
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
                className={styles.MegaMenu__panel}
                onFocus={onFocusPanel}
                onMouseOver={onFocusPanel}
                aria-hidden={!isMegaMenuExpanded}
                aria-labelledby={Array.from({ length: 2 }, (_, index) => ID[`LABEL${index + 1}`]).join(' ')}
              >
                <ul className={styles.MegaMenu__content}>
                  {panelMenuList?.map((menu) => (
                    <li className={styles.MegaMenu__menu}>
                      {/* TODO: 키보드 Focus 접근성 향상 */}
                      <Link className={styles.MegaMenu__link} to={menu.link}>
                        {menu.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ul className={styles['Header__auth-menu']}>
              {!isLoggedin ? (
                <>
                  <li className={styles['Header__auth-link']}>
                    <Link to="/signup">
                      회원가입
                    </Link>
                  </li>
                  <li className={styles['Header__auth-link']}>
                    <Link to="/login">
                      로그인
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className={styles['Header__auth-link']}>
                    <Link to="/modifyinfo">
                      정보수정
                    </Link>
                  </li>
                  <li className={styles['Header__auth-link']}>
                    <Link to="/logout">
                      로그아웃
                    </Link>
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
