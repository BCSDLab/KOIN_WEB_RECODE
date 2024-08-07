import { cn } from '@bcsdlab/utils';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY, Category, Submenu } from 'static/category';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useLogout } from 'utils/hooks/auth/useLogout';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './PCHeader.module.scss';

const ID: { [key: string]: string; } = {
  PANEL: 'megamenu-panel',
  LABEL1: 'megamenu-label-1',
  LABEL2: 'megamenu-label-2',
};

const useMegaMenu = (category: Category[]) => {
  const [panelMenuList, setPanelMenuList] = useState<Submenu[] | null>();
  const [isExpanded, setIsExpanded] = useState(false);

  const createOnChangeMenu = (title: string) => () => {
    const selectedSubmenu = category
      .find((categoryInfo) => categoryInfo.title === title)?.submenu ?? null;
    setPanelMenuList(selectedSubmenu);
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

interface PCHeaderProps {
  openModal: () => void;
}

export default function PCHeader({ openModal }: PCHeaderProps) {
  const {
    panelMenuList,
    isExpanded: isMegaMenuExpanded,
    createOnChangeMenu,
    onFocusPanel,
    hideMegaMenu: hideMegamenu,
  } = useMegaMenu(CATEGORY);

  const logout = useLogout();
  const logger = useLogger();
  const token = useTokenState();
  const isLoggedin = !!token;

  return (
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
          [styles.header__megamenu]: true,
          [styles.megamenu]: true,
        })}
        onBlur={hideMegamenu}
        onMouseOut={hideMegamenu}
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
                onBlur={hideMegamenu}
                onMouseOver={createOnChangeMenu(category.title)}
                onMouseOut={hideMegamenu}
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
            {panelMenuList?.slice(0, -2).map((menu) => (
              <li className={styles.megamenu__menu} key={menu.title}>
                {/* TODO: 키보드 Focus 접근성 향상 */}
                <Link
                  className={styles.megamenu__link}
                  to={menu.link}
                  onClick={() => logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'header', value: menu.title })}
                >
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
              <button type="button" className={styles['header__auth-button']} onClick={openModal}>
                정보수정
              </button>
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
  );
}
