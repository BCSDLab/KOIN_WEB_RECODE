import { cn } from '@bcsdlab/utils';
import * as api from 'api';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import { useState, useEffect } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { CATEGORY, Category, Submenu } from 'static/category';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useSessionLogger } from 'utils/hooks/analytics/useSessionLogger';
import { useLogout } from 'utils/hooks/auth/useLogout';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './PCHeader.module.scss';

const ID: { [key: string]: string } = {
  PANEL: 'megamenu-panel',
  LABEL1: 'megamenu-label-1',
  LABEL2: 'megamenu-label-2',
};

const useMegaMenu = (category: Category[]) => {
  const [panelMenuList, setPanelMenuList] = useState<Submenu[] | null>();
  const [isExpanded, setIsExpanded] = useState(false);

  const createOnChangeMenu = (title: string) => () => {
    const selectedSubmenu = category.find((categoryInfo) => categoryInfo.title === title)?.submenu ?? null;
    setPanelMenuList(selectedSubmenu);
    setIsExpanded(true);
  };
  const onFocusPanel = () => {
    setIsExpanded(true);
  };
  const hideMegaMenu = (event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
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
  const sessionLogger = useSessionLogger();
  const token = useTokenState();
  const portalManager = useModalPortal();
  const router = useRouter();
  const { asPath } = router;
  const pathname = asPath.split('?')[0] || '/';
  const search = asPath.includes('?') ? `?${asPath.split('?')[1]}` : '';
  const isStage = process.env.NEXT_PUBLIC_API_PATH?.includes('stage');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedin = mounted && !!token;

  const logShortcut = (title: string) => {
    const loggingMap: Record<string, { team: string; event_label: string; value: string; event_category?: string }> = {
      공지사항: { team: 'CAMPUS', event_label: 'header', value: '공지사항' },
      '버스 교통편': { team: 'CAMPUS', event_label: 'header', value: '버스 교통편' },
      '버스 시간표': { team: 'CAMPUS', event_label: 'header', value: '버스 시간표' },
      식단: { team: 'CAMPUS', event_label: 'header', value: '식단' },
      시간표: { team: 'USER', event_label: 'header', value: '시간표' },
      복덕방: { team: 'BUSINESS', event_label: 'header', value: '복덕방' },
      주변상점: {
        team: 'BUSINESS',
        event_label: 'header',
        value: '주변상점',
        event_category: 'click',
      },
      '교내 시설물 정보': {
        team: 'CAMPUS',
        event_label: 'header',
        value: '교내 시설물 정보',
        event_category: 'click',
      },
      쪽지: {
        team: 'CAMPUS',
        event_label: 'header',
        value: '쪽지',
        event_category: 'click',
      },
      동아리: {
        team: 'CAMPUS',
        event_label: 'header',
        value: '동아리',
        event_category: 'click',
      },
    };

    if (loggingMap[title]) {
      logger.actionEventClick(loggingMap[title]);

      if (pathname === ROUTES.GraduationCalculator()) {
        logger.actionEventClick({
          team: 'USER',
          event_label: 'graduation_calculator_back',
          value: `탈출_헤더_${title}`,
        });
      }
    }
  };

  const escapeByLogo = async () => {
    if (pathname === ROUTES.Timetable()) {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'timetable_back',
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
        team: 'BUSINESS',
        event_label: 'shop_detail_view_back',
        value: shopName.name,
        event_category: 'logo',
        current_page: sessionStorage.getItem('cameFrom') || '전체보기',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enter_storeDetail'))) / 1000,
      });
    }
    if (pathname.includes(ROUTES.GraduationCalculator())) {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'graduation_calculator_back',
        value: '탈출_로고',
      });
    }
  };

  const escapeByheader = async (title: string) => {
    if (pathname === ROUTES.GraduationCalculator()) {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'graduation_calculator_back',
        value: `탈출_헤더_${title}`,
      });
    }
  };

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal title="쪽지를 사용하기" description="로그인 후 이용해주세요." onClose={portalOption.close} />
    ));
  };

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, title: string) => {
    logShortcut(title);
    if (!token && title === '쪽지') {
      e.preventDefault();
      openLoginModal();
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <>
      <Link className={styles.header__logo} href={ROUTES.Main()} tabIndex={0} onClick={escapeByLogo}>
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
            <li key={category.title}>
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
                <span>{category.title}</span>
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
            {panelMenuList?.slice(0, -4).map((menu) => {
              const preferred = isStage && menu.stageLink ? menu.stageLink : menu.link;
              const href = preferred ?? ROUTES.Main();
              return (
                <li className={styles.megamenu__menu} key={menu.title}>
                  {/* TODO: 키보드 Focus 접근성 향상 */}
                  <Link className={styles.megamenu__link} href={href} onClick={(e) => handleMenuClick(e, menu.title)}>
                    {menu.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <ul className={styles['header__auth-menu']}>
        {!isLoggedin ? (
          <>
            <li className={styles['header__auth-link']}>
              <Link
                href={ROUTES.AuthSignup({ currentStep: '약관동의', isLink: true })}
                onClick={() => {
                  sessionLogger.actionSessionEvent({
                    session_name: 'sign_up',
                    event_label: 'header',
                    value: '회원가입 시작',
                    event_category: 'click',
                  });
                }}
              >
                회원가입
              </Link>
            </li>
            <li className={styles['header__auth-link']}>
              <Link
                href={ROUTES.Auth()}
                onClick={() => {
                  logger.actionEventClick({
                    team: 'USER',
                    event_label: 'header',
                    value: '로그인 시도',
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
                  escapeByheader('정보수정');
                }}
              >
                정보수정
              </button>
            </li>
            <li className={styles['header__auth-link']}>
              <button
                onClick={() => {
                  logout();
                  escapeByheader('로그아웃');
                  logger.actionEventClick({
                    team: 'USER',
                    event_label: 'header',
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
