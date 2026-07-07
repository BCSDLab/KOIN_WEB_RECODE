import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import AuthenticateUserModal from 'components/AuthenticateUserModal';
import ROUTES from 'static/routes';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import MobileHeader from './MobileHeader';
import PCHeader from './PCHeader';
import styles from './Header.module.scss';

function Header() {
  const router = useRouter();
  const pathname = router.asPath || router.pathname;
  const isMain = pathname === '/';
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  const isClubRoute = [ROUTES.NewClub(), '/clubs/edit', ROUTES.Club()].some((prefix) => pathname.startsWith(prefix));
  const isArticleRoute = pathname.startsWith(ROUTES.Articles());

  return (
    <header
      className={cn({
        [styles.header]: true,
        [styles['header--main']]: isMain,
        [styles['header--new-club']]: isClubRoute,
        [styles['header--mobile-light']]: isArticleRoute,
      })}
    >
      <nav className={styles.header__content}>
        <div className={styles['header__desktop']}>
          <PCHeader openModal={openModal} />
        </div>
        <div className={styles['header__mobile']}>
          <MobileHeader openModal={openModal} />
        </div>
      </nav>
      {isModalOpen && <AuthenticateUserModal onClose={closeModal} />}
    </header>
  );
}

export default Header;
