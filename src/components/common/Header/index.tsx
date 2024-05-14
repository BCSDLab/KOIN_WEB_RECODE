import { useLocation } from 'react-router-dom';
import useBooleanState from 'utils/hooks/useBooleanState';
import useMediaQuery from 'utils/hooks/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import AuthenticateUserModal from 'pages/Auth/ModifyInfoPage/components/AuthenticateUserModal';
import styles from './Header.module.scss';
import PCHeader from './PCHeader';
import MobileHeader from './MobileHeader';

function Header() {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery();
  const isMain = pathname === '/';
  const [isModalOpen,, closeModal] = useBooleanState(false);

  return (
    <header
      className={cn({
        [styles.header]: true,
        [styles['header--main']]: isMain,
      })}
    >
      <nav className={styles.header__content}>
        {isMobile ? (
          <MobileHeader />
        ) : (
          <PCHeader />
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
