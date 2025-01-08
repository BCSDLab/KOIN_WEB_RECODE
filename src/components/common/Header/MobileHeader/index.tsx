import { cn } from '@bcsdlab/utils';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import HamburgerIcon from 'assets/svg/hamburger-icon.svg';
import KoinServiceLogo from 'assets/svg/koin-service-logo.svg';
import ArrowBackIcon from 'assets/svg/white-arrow-back-icon.svg';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useResetHeaderButton } from 'utils/hooks/layout/useResetHeaderButton';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';
import * as api from 'api';
import { CATEGORY } from 'static/category';
import ROUTES from 'static/routes';
import styles from './MobileHeader.module.scss';
import Panel from './Panel';

interface MobileHeaderProps {
  openModal: () => void;
}

export default function MobileHeader({ openModal }: MobileHeaderProps) {
  useResetHeaderButton();
  const { pathname } = useLocation();
  const { openSidebar } = useMobileSidebar();
  const buttonState = useHeaderButtonStore((state) => state.buttonState);

  const isMain = pathname === ROUTES.Main();
  const isCustomButton = buttonState.type === 'custom';
  const navigate = useNavigate();
  const logger = useLogger();
  const { id } = useParams();
  const backInDetailPage = async () => {
    if (pathname.includes(ROUTES.Store()) && id) {
      const response = await api.store.getStoreDetailInfo(id!);
      logger.actionEventClick({
        actionTitle: 'BUSINESS',
        title: 'shop_detail_view_back',
        value: response.name,
        event_category: 'click',
        current_page: sessionStorage.getItem('cameFrom') || '',
        duration_time:
          (new Date().getTime() - Number(sessionStorage.getItem('enter_storeDetail'))) / 1000,
      }); // 상점 내 뒤로가기 버튼 로깅
      navigate(-1);
      return;
    }
    if (pathname === '/timetable') {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'timetable_back',
        value: '뒤로가기버튼',
        previous_page: '시간표',
        current_page: '메인',
        duration_time:
          (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
    }
    navigate(-1);
  };

  const handleHamburgerClick = () => {
    openSidebar();
  };

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
            <ArrowBackIcon />
          </button>
        )}
        <span
          className={cn({
            [styles.mobileheader__title]: true,
            [styles['mobileheader__title--main']]: isMain,
          })}
        >
          {isMain ? (
            <KoinServiceLogo />
          ) : (
            (CATEGORY.flatMap((category) => category.submenu).find((submenu) =>
              pathname.startsWith(submenu.link)
            )?.title ?? '')
          )}
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
