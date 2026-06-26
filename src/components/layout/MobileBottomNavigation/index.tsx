import Link from 'next/link';
import { useRouter } from 'next/router';
import CategoryIcon from 'assets/svg/common/category-icon.svg';
import ClipBoardIcon from 'assets/svg/common/clipboard-icon.svg';
import HomeIcon from 'assets/svg/common/home-icon.svg';
import UserIcon from 'assets/svg/common/user-icon.svg';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './MobileBottomNavigation.module.scss';

const NAVIGATION_ITEMS = [
  {
    key: 'home',
    event_label: 'nav_home',
    label: '홈',
    href: ROUTES.Main(),
    Icon: HomeIcon,
  },
  {
    key: 'category',
    event_label: 'nav_category',
    label: '카테고리',
    href: ROUTES.Category(),
    Icon: CategoryIcon,
  },
  {
    key: 'board',
    event_label: 'nav_bulletin',
    label: '게시판',
    href: ROUTES.Articles(),
    Icon: ClipBoardIcon,
  },
  {
    key: 'profile',
    event_label: 'nav_profile',
    label: '프로필',
    href: ROUTES.AuthModifyInfo(),
    Icon: UserIcon,
  },
];

const isNavigationActive = (pathname: string, key: string, href: string) => {
  if (key === 'home') return pathname === href;
  if (key === 'profile') return pathname === ROUTES.AuthModifyInfo() || pathname === ROUTES.Auth();

  return pathname === href || pathname.startsWith(`${href}/`);
};

function MobileBottomNavigation() {
  const { pathname } = useRouter();
  const logger = useLogger();
  const token = useTokenState();

  return (
    <nav className={styles.navigation} aria-label="하단 메뉴">
      <ul className={styles['navigation__list']}>
        {NAVIGATION_ITEMS.map(({ key, event_label, label, href, Icon }) => {
          const resolvedHref = key === 'profile' && !token ? ROUTES.Auth() : href;
          const isActive = isNavigationActive(pathname, key, resolvedHref);

          return (
            <li
              key={key}
              className={`${styles.navigation__item} ${isActive ? styles['navigation__item--active'] : ''}`}
            >
              <Link
                href={resolvedHref}
                className={styles.navigation__link}
                aria-current={isActive ? 'page' : undefined}
                onClick={() =>
                  logger.actionEventClick({
                    team: 'CAMPUS',
                    event_label: event_label,
                    value: label,
                  })
                }
              >
                <Icon className={styles.navigation__icon} />
                <span className={styles.navigation__label}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MobileBottomNavigation;
