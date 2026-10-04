import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import AuthenticateUserModal from 'components/AuthenticateUserModal';
import useBooleanState from 'utils/hooks/state/useBooleanState';

import MobileHeader from './MobileHeader';
import { getLegacyRoute } from './MobileHeader/legacyRoute';
import type { LegacyRoute } from './MobileHeader/legacyRoute';
import MobileHomeRedesignHeader from './MobileHomeRedesignHeader';
import PCHeader from './PCHeader';
import styles from './Header.module.scss';

function getLegacyClassNames(route: LegacyRoute) {
  return {
    [styles['header--main']]: route.isMain,
    [styles['header--mobile-light']]: route.isLight,
  };
}

/**
 * - `page`: 리디자인 페이지. 레거시 헤더를 숨기고 페이지가 `MobilePageHeader`를 직접 그린다.
 * - `home`: 하단 탭이 있는 홈 화면 헤더.
 * - 지정하지 않으면 경로로 판정하는 레거시 헤더.
 */
export type MobileHeaderVariant = 'page' | 'home';

interface HeaderProps {
  mobileHeader?: MobileHeaderVariant;
}

function Header({ mobileHeader }: HeaderProps) {
  const router = useRouter();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const legacyRoute = mobileHeader ? null : getLegacyRoute(router.pathname);

  const renderMobileHeader = () => {
    if (legacyRoute) {
      return <MobileHeader openModal={openModal} route={legacyRoute} />;
    }

    return mobileHeader === 'home' ? <MobileHomeRedesignHeader /> : null;
  };

  return (
    <header
      className={cn({
        [styles.header]: true,
        ...(legacyRoute && getLegacyClassNames(legacyRoute)),
        [styles['header--mobile-home']]: mobileHeader === 'home',
        [styles['header--mobile-none']]: mobileHeader === 'page',
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
