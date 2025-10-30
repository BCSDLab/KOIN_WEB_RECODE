import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import * as api from 'api';
import BlackArrowBackIcon from 'assets/svg/black-arrow-back-icon.svg';
import HamburgerIcon from 'assets/svg/hamburger-icon.svg';
import KoinServiceLogo from 'assets/svg/koin-service-logo.svg';
import ArrowBackIcon from 'assets/svg/white-arrow-back-icon.svg';
import { CATEGORY } from 'static/category';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useResetHeaderButton } from 'utils/hooks/layout/useResetHeaderButton';
import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import { backButtonTapped } from 'utils/ts/iosBridge';
import { useHeaderTitle } from 'utils/zustand/customTitle';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';
import Panel from './Panel';
import styles from './MobileHeader.module.scss';

interface MobileHeaderProps {
  openModal: () => void;
}

export default function MobileHeader({ openModal }: MobileHeaderProps) {
  useResetHeaderButton();
  const router = useRouter();
  const { pathname } = router;
  const { openSidebar } = useMobileSidebar();
  const buttonState = useHeaderButtonStore((state) => state.buttonState);

  const isMain = pathname === ROUTES.Main();
  const isCustomButton = buttonState.type === 'custom';
  const logger = useLogger();
  const { id } = router.query;

  const { customTitle } = useHeaderTitle();

  const { params } = useParamsHandler();

  const backInDetailPage = async () => {
    if (pathname.includes(ROUTES.Store()) && id) {
      const response = await api.store.getStoreDetailInfo(Array.isArray(id) ? id[0] : id);
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_back',
        value: response.name,
        event_category: 'click',
        current_page: sessionStorage.getItem('cameFrom') || '',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enter_storeDetail'))) / 1000,
      }); // 상점 내 뒤로가기 버튼 로깅
      router.back();
      return;
    }
    if (pathname === '/timetable') {
      logger.actionEventClick({
        team: 'USER',
        event_label: 'timetable_back',
        value: '뒤로가기버튼',
        previous_page: '시간표',
        current_page: '메인',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
    }

    if (
      typeof window !== 'undefined' &&
      window.webkit?.messageHandlers != null &&
      (pathname === ROUTES.Club() || params.hot === 'true')
    ) {
      backButtonTapped();
      return;
    }
    // 메인 페이지가 아닌 페이지로 접근한 경우 뒤로가기하면 메인으로
    if (window.history.state?.idx === 0) {
      router.push(ROUTES.Main());
    } else {
      router.back();
    }
  };

  const handleHamburgerClick = () => {
    openSidebar();
  };

  const isClubRoute = [ROUTES.NewClub(), '/clubs/edit', ROUTES.Club()].some((prefix) => pathname.startsWith(prefix));

  return (
    <>
      <div className={styles.mobileheader}>
        {!isMain && (
          <button
            className={cn({
              [styles.mobileheader__icon]: true,
              [styles['mobileheader__icon--left']]: true,
            })}
            type="button"
            aria-label="뒤로가기 버튼"
            onClick={() => {
              backInDetailPage();
            }}
          >
            {isClubRoute ? <BlackArrowBackIcon /> : <ArrowBackIcon />}
          </button>
        )}
        <span
          className={cn({
            [styles.mobileheader__title]: true,
            [styles['mobileheader__title--main']]: isMain,
            [styles['mobileheader__title--new-club']]: isClubRoute,
          })}
        >
          {isMain && <KoinServiceLogo />}
          {!isMain && isClubRoute && customTitle}
          {!isMain &&
            !isClubRoute &&
            (CATEGORY.flatMap((c) => c.submenu).find((s) => pathname.startsWith(s.link))?.title ?? '')}
          {pathname.startsWith(ROUTES.NewClub()) && '동아리 생성'}
          {pathname.startsWith('/clubs/edit') && '동아리 수정'}
          {pathname.startsWith('/clubs/recruitment/edit') && '동아리 모집 수정'}
          {pathname.startsWith('/clubs/recruitment') &&
            !pathname.startsWith('/clubs/recruitment/edit') &&
            '동아리 모집 생성'}
          {pathname.startsWith('/clubs/event/edit') && '동아리 행사 수정'}
          {pathname.startsWith('/clubs/event') && !pathname.startsWith('/clubs/event/edit') && '동아리 행사 생성'}
        </span>
        {isCustomButton ? (
          <span
            className={cn({
              [styles.mobileheader__icon]: true,
              [styles['mobileheader__icon--right']]: true,
            })}
          >
            {buttonState.content}
          </span>
        ) : (
          <button
            className={cn({
              [styles.mobileheader__icon]: true,
              [styles['mobileheader__icon--right']]: true,
              [styles['mobileheader__icon--none']]: isClubRoute,
            })}
            type="button"
            aria-label="메뉴 버튼"
            onClick={handleHamburgerClick}
          >
            <HamburgerIcon />
          </button>
        )}
      </div>
      {createPortal(<Panel openModal={openModal} />, document.body)}
    </>
  );
}
