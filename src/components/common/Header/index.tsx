import { cn } from '@bcsdlab/utils';
import { useLocation } from 'react-router-dom';
import AuthenticateUserModal from 'pages/Auth/ModifyInfoPage/components/AuthenticateUserModal';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './Header.module.scss';
import MobileHeader from './MobileHeader';
import PCHeader from './PCHeader';

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
      })}
    >
      <nav className={styles.header__content}>
        {isMobile ? <MobileHeader openModal={openModal} /> : <PCHeader openModal={openModal} />}
      </nav>
      {isModalOpen && <AuthenticateUserModal onClose={closeModal} />}
    </header>
  );
}

export default Header;
