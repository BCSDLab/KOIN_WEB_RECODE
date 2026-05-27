import Link from 'next/link';
import { useRouter } from 'next/router';
import CategoryIcon from 'assets/svg/common/category-icon.svg';
import ClipBoardIcon from 'assets/svg/common/clipboard-icon.svg';
import HomeIcon from 'assets/svg/common/home-icon.svg';
import UserIcon from 'assets/svg/common/user-icon.svg';
import ROUTES from 'static/routes';
import styles from './MobileBottomNavigation.module.scss';

const NAVIGATION_ITEMS = [
  {
    key: 'home',
    label: '홈',
    href: ROUTES.Main(),
    Icon: HomeIcon,
  },
  {
    key: 'category',
    label: '카테고리',
    // TODO: 카테고리 페이지 라우트 확정 시 수정
    href: '/category',
    Icon: CategoryIcon,
  },
  {
    key: 'board',
    label: '게시판',
    href: ROUTES.Articles(),
    Icon: ClipBoardIcon,
  },
  {
    key: 'profile',
    label: '프로필',
    href: ROUTES.AuthModifyInfo(),
    Icon: UserIcon,
  },
];

function MobileBottomNavigation() {
  const { pathname } = useRouter();

  return (
    <nav className={styles.navigation} aria-label="하단 메뉴">
      <ul className={styles['navigation__list']}>
        {NAVIGATION_ITEMS.map(({ key, label, href, Icon }) => {
          const isActive = pathname === href;

          return (
            <li
              key={key}
              className={`${styles.navigation__item} ${isActive ? styles['navigation__item--active'] : ''}`}
            >
              <Link href={href} className={styles.navigation__link}>
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
