import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import AuthenticateUserModal from 'components/AuthenticateUserModal';
import useBooleanState from 'utils/hooks/state/useBooleanState';

import MobileHeader from './MobileHeader';
import { getLegacyRoute } from './MobileHeader/legacyRoute';
import type { LegacyRoute } from './MobileHeader/legacyRoute';
import type { MobileHeaderConfig } from './mobileHeaderConfig';
import MobileHomeRedesignHeader from './MobileHomeRedesignHeader';
import PCHeader from './PCHeader';
import styles from './Header.module.scss';

function getLegacyClassNames(route: LegacyRoute) {
  const isPage = route.isBusTimetable || route.isTimetable;

  return {
    [styles['header--main']]: route.isMain,
    [styles['header--mobile-light']]: route.isLight || isPage,
    [styles['header--page']]: isPage,
  };
}

// 서브 헤더(`page`, `page-owned`)는 레이아웃이나 페이지가 MobilePageHeader로 그리므로 모바일에선 숨긴다
function getClassNames(config: MobileHeaderConfig) {
  return config.type === 'home' ? { [styles['header--mobile-home']]: true } : { [styles['header--mobile-none']]: true };
}

interface HeaderProps {
  mobileHeader?: MobileHeaderConfig;
}

function Header({ mobileHeader }: HeaderProps) {
  const router = useRouter();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const legacyRoute = mobileHeader ? null : getLegacyRoute(router.pathname);

  const renderMobileHeader = () => {
    if (legacyRoute) {
      return <MobileHeader openModal={openModal} route={legacyRoute} />;
    }

    return mobileHeader?.type === 'home' ? <MobileHomeRedesignHeader /> : null;
  };

  return (
    <header
      className={cn({
        [styles.header]: true,
        ...(legacyRoute ? getLegacyClassNames(legacyRoute) : mobileHeader && getClassNames(mobileHeader)),
      })}
    >
      <nav className={styles.header__content}>
        <div className={styles['header__desktop']}>
          <PCHeader openModal={openModal} />
        </div>
        <div className={styles['header__mobile']}>{renderMobileHeader()}</div>
      </nav>
      {isModalOpen && <AuthenticateUserModal onClose={closeModal} />}
    </header>
  );
}

export default Header;
