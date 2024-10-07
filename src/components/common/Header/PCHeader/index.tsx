import { cn } from '@bcsdlab/utils';
import * as api from 'api';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORY, Category, Submenu } from 'static/category';
import ROUTES from 'static/routes';
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
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const isLoggedin = !!token;
  const logShortcut = (title: string) => {
    if (title === '식단') logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'header', value: '식단' });
    if (title === '버스/교통') logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'header', value: '버스/교통' });
    if (title === '공지사항') logger.actionEventClick({ actionTitle: 'CAMPUS', title: 'header', value: '공지사항' });
    if (title === '주변상점') {
      logger.actionEventClick({
        actionTitle: 'BUSINESS', title: 'header', value: '주변상점', event_category: 'click',
      });
    }
    if (title === '복덕방') logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'header', value: '복덕방' });
    if (title === '시간표') logger.actionEventClick({ actionTitle: 'USER', title: 'header', value: '시간표' });
  };

  const escapeByLogo = async () => {
    if (pathname === ROUTES.Timetable()) {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'timetable_back',
        value: '로고',
        previous_page: '시간표',
        current_page: '메인',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
    }
    if (pathname.includes(ROUTES.Store()) && search.includes('state')) {
      const shopId = pathname.split('/')[2];
      const shopName = await api.store.getStoreDetailInfo(shopId);
      logger.actionEventClick({
        actionTitle: 'BUSINESS',
        title: 'shop_detail_view_back',
        value: shopName.name,
        event_category: 'logo',
        current_page: sessionStorage.getItem('cameFrom') || '전체보기',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enter_storeDetail'))) / 1000,
      });
    }
    navigate(ROUTES.Main(), { replace: true });
  };

  return (
    <>
      <Link
        className={styles.header__logo}
        to={ROUTES.Main()}
        tabIndex={0}
        onClick={escapeByLogo}
        type="button"
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
            {panelMenuList?.slice(0, -3).map((menu) => (
              <li className={styles.megamenu__menu} key={menu.title}>
                {/* TODO: 키보드 Focus 접근성 향상 */}
                <Link
                  className={styles.megamenu__link}
                  to={menu.link}
                  onClick={() => logShortcut(menu.title)}
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
              <Link
                to={ROUTES.AuthSignup()}
                onClick={() => {
                  logger.actionEventClick({
                    actionTitle: 'USER',
                    title: 'header',
                    value: '회원가입',
                  });
                }}
              >
                회원가입
              </Link>
            </li>
            <li className={styles['header__auth-link']}>
              <Link
                to={ROUTES.Auth()}
                onClick={() => {
                  logger.actionEventClick({
                    actionTitle: 'USER',
                    title: 'header',
                    value: '로그인',
                  });
                }}
              >
                로그인
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className={styles['header__auth-link']}>
              <button
                type="button"
                className={styles['header__auth-button']}
                onClick={() => {
                  openModal();
                  logger.actionEventClick({
                    actionTitle: 'USER',
                    title: 'header',
                    value: '정보수정',
                  });
                }}
              >
                정보수정
              </button>
            </li>
            <li className={styles['header__auth-link']}>
              <button
                onClick={() => {
                  logout();
                  logger.actionEventClick({
                    actionTitle: 'USER',
                    title: 'header',
                    value: '로그아웃',
                  });
                }}
                type="button"
                className={styles['header__auth-button']}
              >
                로그아웃
              </button>
            </li>
          </>
        )}
      </ul>
    </>
  );
}
