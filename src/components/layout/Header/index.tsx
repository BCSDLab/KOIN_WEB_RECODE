import { useLocation } from 'react-router-dom';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import AuthenticateUserModal from 'pages/Auth/ModifyInfoPage/components/AuthenticateUserModal';
import ROUTES from 'static/routes';
import styles from './Header.module.scss';
import PCHeader from './PCHeader';
import MobileHeader from './MobileHeader';

function Header() {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery();
  const isMain = pathname === '/';
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  return (
    <header
      className={cn({
        [styles.header]: true,
        [styles['header--main']]: isMain,
        [styles['header--new-club']]: pathname.startsWith(ROUTES.NewClub()),
      })}
    >
      <nav className={styles.header__content}>
        {isMobile ? (
          <MobileHeader openModal={openModal} />
        ) : (
          <PCHeader openModal={openModal} />
        )}
      </nav>
      {isModalOpen && (
        <AuthenticateUserModal
          onClose={closeModal}
        />
      )}
    </header>
  );
}

export default Header;
