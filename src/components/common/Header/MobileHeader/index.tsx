import { cn } from '@bcsdlab/utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CATEGORY } from 'static/category';
import useLogger from 'utils/hooks/analytics/useLogger';
import * as api from 'api';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';
import { createPortal } from 'react-dom';
import { ReactComponent as HamburgerIcon } from 'assets/svg/hamburger-icon.svg';
import { ReactComponent as KoinServiceLogo } from 'assets/svg/koin-service-logo.svg';
import { ReactComponent as WhiteArrowBackIcon } from 'assets/svg/white-arrow-back-icon.svg';
import { useHeaderButtonStore } from 'utils/zustand/headerButtonStore';
import { useResetHeaderButton } from 'utils/hooks/layout/useResetHeaderButton';
import Panel from './Panel';
import styles from './MobileHeader.module.scss';

interface MobileHeaderProps {
  openModal: () => void;
}

export default function MobileHeader({ openModal }: MobileHeaderProps) {
  useResetHeaderButton();
  const { pathname } = useLocation();
  const { openSidebar } = useMobileSidebar();
  const buttonState = useHeaderButtonStore((state) => state.buttonState);

  const isMain = pathname === '/';
  const isCustomButton = buttonState.type === 'custom';
  const navigate = useNavigate();
  const logger = useLogger();
  const params = useParams();

  const backInDetailPage = async () => {
    if (pathname.includes('/store/') && params) {
      const response = await api.store.getStoreDetailInfo(params.id!);
      logger.actionEventClick({
        actionTitle: 'BUSINESS', title: 'shop_detail_view_back', value: response.name, event_category: 'click',
      }); // 상점 내 뒤로가기 버튼 로깅
    }
    if (pathname === '/timetable') {
      logger.actionEventClick({
        actionTitle: 'USER',
        title: 'timetable_back',
        value: '뒤로가기버튼',
        previous_page: '시간표',
        current_page: '메인',
        duration_time: (new Date().getTime() - Number(sessionStorage.getItem('enterTimetablePage'))) / 1000,
      });
    }
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
              navigate(-1);
            }}
          >
            <WhiteArrowBackIcon />
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
            CATEGORY
              .flatMap((category) => category.submenu)
              .find((submenu) => pathname.startsWith(submenu.link))?.title ?? ''
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
      {createPortal(
        <Panel openModal={openModal} />,
        document.body,
      )}
    </>
  );
}
