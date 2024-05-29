import { cn } from '@bcsdlab/utils';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CATEGORY } from 'static/category';
import useLogger from 'utils/hooks/useLogger';
import * as api from 'api';
import { useMobileSidebar } from 'utils/zustand/mobileSidebar';
import { createPortal } from 'react-dom';
import { ReactComponent as HamburgerIcon } from 'assets/svg/hamburger-icon.svg';
import { ReactComponent as KoinServiceLogo } from 'assets/svg/koin-service-logo.svg';
import { ReactComponent as WhiteArrowBackIcon } from 'assets/svg/white-arrow-back-icon.svg';
import styles from './MobileHeader.module.scss';
import Panel from './Panel';

interface Props {
  openModal: () => void;
}

export default function MobileHeader({ openModal }: Props) {
  const { pathname } = useLocation();
  const { openSidebar } = useMobileSidebar();

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
    openSidebar();
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
          ) : (
            CATEGORY
              .flatMap((category) => category.submenu)
              .find((submenu) => pathname.startsWith(submenu.link))?.title ?? ''
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
      {createPortal(
        <Panel openModal={openModal} />,
        document.body,
      )}
    </>
  );
}
