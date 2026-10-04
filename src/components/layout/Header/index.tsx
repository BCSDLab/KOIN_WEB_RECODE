import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import AuthenticateUserModal from 'components/AuthenticateUserModal';
import PageHeader from 'components/ui/PageHeader';
import useLogger from 'utils/hooks/analytics/useLogger';
import useGoBack from 'utils/hooks/routing/useGoBack';
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

function getClassNames(config: MobileHeaderConfig) {
  if (config.type === 'home') return { [styles['header--mobile-home']]: true };

  return {
    [styles['header--mobile-light']]: true,
    [styles['header--page']]: true,
    [styles['header--mobile-gray']]: config.background === 'gray',
  };
}

interface HeaderProps {
  mobileHeader?: MobileHeaderConfig;
}

function Header({ mobileHeader }: HeaderProps) {
  const router = useRouter();
  const logger = useLogger();
  const goBack = useGoBack();
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const legacyRoute = mobileHeader ? null : getLegacyRoute(router.pathname);

  const renderMobileHeader = () => {
    if (legacyRoute) {
      return <MobileHeader openModal={openModal} route={legacyRoute} />;
    }

    if (mobileHeader?.type !== 'page') return <MobileHomeRedesignHeader />;

    const { title: Title, rightAction: RightAction, onBack } = mobileHeader;

    return (
      <PageHeader
        title={typeof Title === 'string' ? Title : <Title />}
        rightAction={RightAction && <RightAction />}
        onBack={onBack && (() => onBack({ router, logger, goBack }))}
        className={styles['header__page-header']}
      />
    );
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
