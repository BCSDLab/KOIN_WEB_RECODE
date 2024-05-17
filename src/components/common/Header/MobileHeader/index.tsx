import { cn } from '@bcsdlab/utils';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CATEGORY } from 'static/category';
import useBooleanState from 'utils/hooks/useBooleanState';
import useLogger from 'utils/hooks/useLogger';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import * as api from 'api';
import { createPortal } from 'react-dom';
import { ReactComponent as HamburgerIcon } from 'assets/svg/hamburger-icon.svg';
import { ReactComponent as KoinServiceLogo } from 'assets/svg/koin-service-logo.svg';
import { ReactComponent as WhiteArrowBackIcon } from 'assets/svg/white-arrow-back-icon.svg';
import styles from './MobileHeader.module.scss';
import Panel from './Panel';

function useMobileSidebar(pathname: string, isMobile: boolean) {
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
}

export default function MobileHeader() {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery();
  const {
    isExpanded,
    hideSidebar,
    expandSidebar,
  } = useMobileSidebar(pathname, isMobile);

  const isMain = pathname === '/';
  const navigate = useNavigate();
  const logger = useLogger();
  const params = useParams();

  const backInDetailPage = async () => {
    if (pathname.includes('/store/') && params) {
      const response = await api.store.getStoreDetailInfo(params.id!);
      logger.actionEventClick({ actionTitle: 'BUSINESS', title: 'shop_back_button', value: response.name }); // 상점 내 뒤로가기 버튼 로깅
    }
  };

  const handleHamburgerClick = () => {
    expandSidebar();
    logger.actionEventClick({
      actionTitle: 'USER',
      title: 'hamburger',
      value: '햄버거',
    });
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
          aria-label="메뉴 버튼"
          onClick={handleHamburgerClick}
        >
          <HamburgerIcon />
        </button>
      </div>
      {createPortal(<Panel isExpanded={isExpanded} hideSidebar={hideSidebar} />, document.body)}
    </>
  );
}
