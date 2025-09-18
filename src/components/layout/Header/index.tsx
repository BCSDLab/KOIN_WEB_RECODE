import { useRouter } from 'next/router';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { cn } from '@bcsdlab/utils';
import AuthenticateUserModal from 'components/AuthenticateUserModal';
import ROUTES from 'static/routes';
import styles from './Header.module.scss';
import PCHeader from './PCHeader';
import MobileHeader from './MobileHeader';

function Header() {
  const router = useRouter();
  const pathname = router.asPath || router.pathname;
  const isMobile = useMediaQuery();
  const isMain = pathname === '/';
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  const isClubRoute = [
    ROUTES.NewClub(),
    '/clubs/edit',
    ROUTES.Club(),
  ].some((prefix) => pathname.startsWith(prefix));

  return (
    <header
      className={cn({
        [styles.header]: true,
        [styles['header--main']]: isMain,
        [styles['header--new-club']]: isClubRoute && isMobile,
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
