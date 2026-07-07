import type { ComponentType, ReactNode, SVGProps } from 'react';
import Link from 'next/link';
import BriefcaseIcon from 'assets/svg/category/briefcase-icon.svg';
import CalendarIcon from 'assets/svg/category/calendar-icon.svg';
import DeliveryBoxIcon from 'assets/svg/category/delivery-box-icon.svg';
import DishIcon from 'assets/svg/category/dish-icon.svg';
import HomeIcon from 'assets/svg/category/home-icon.svg';
import PermanentJobIcon from 'assets/svg/category/permanent-job-icon.svg';
import StoreIcon from 'assets/svg/category/store-icon.svg';
import UserAddIcon from 'assets/svg/category/user-add-icon.svg';
import ArrowRightIcon from 'assets/svg/common/arrow-right-icon.svg';
import BusTimeIcon from 'assets/svg/common/bus-time-icon.svg';
import RouteIcon from 'assets/svg/common/route-icon.svg';
import HomeLayout from 'components/layout/HomeLayout';
import IconBox from 'components/ui/IconBox';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './CategoryPage.module.scss';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;
type CategoryLoggingTeam = 'USER' | 'CAMPUS' | 'BUSINESS';
type CategoryEventLabel =
  | 'category_timetable'
  | 'category_lost_property'
  | 'category_campus'
  | 'category_transportation'
  | 'category_etc';

interface CategoryLogging {
  team: CategoryLoggingTeam;
  event_label: CategoryEventLabel;
  value: string;
}

interface CategoryItem {
  title: string;
  description?: string;
  href: string;
  Icon?: IconComponent;
  logging: CategoryLogging;
}

interface CategorySection {
  title: string;
  items: CategoryItem[];
}

const quickMenus: CategoryItem[] = [
  {
    title: '시간표',
    description: '내 강의 정보 확인하기',
    href: ROUTES.Timetable(),
    Icon: CalendarIcon,
    logging: {
      team: 'USER',
      event_label: 'category_timetable',
      value: '시간표',
    },
  },
  {
    title: '분실물',
    description: '분실물 신고 / 조회하기',
    href: ROUTES.LostItems(),
    Icon: DeliveryBoxIcon,
    logging: {
      team: 'CAMPUS',
      event_label: 'category_lost_property',
      value: '분실물',
    },
  },
];

const sections: CategorySection[] = [
  {
    title: '캠퍼스',
    items: [
      {
        title: '교내 시설물 정보',
        href: ROUTES.CampusInfo(),
        Icon: PermanentJobIcon,
        logging: {
          team: 'CAMPUS',
          event_label: 'category_campus',
          value: '교내 시설물 정보',
        },
      },
      {
        title: '식단',
        href: ROUTES.Cafeteria(),
        Icon: DishIcon,
        logging: {
          team: 'CAMPUS',
          event_label: 'category_campus',
          value: '식단',
        },
      },
      {
        title: '주변상점',
        href: ROUTES.Store(),
        Icon: StoreIcon,
        logging: {
          team: 'BUSINESS',
          event_label: 'category_campus',
          value: '주변상점',
        },
      },
    ],
  },
  {
    title: '교통',
    items: [
      {
        title: '버스 시간표',
        href: ROUTES.BusCourseShuttle(),
        Icon: BusTimeIcon,
        logging: {
          team: 'CAMPUS',
          event_label: 'category_transportation',
          value: '버스 시간표',
        },
      },
      {
        title: '교통편 조회하기',
        href: ROUTES.BusRoute(),
        Icon: RouteIcon,
        logging: {
          team: 'CAMPUS',
          event_label: 'category_transportation',
          value: '교통편 조회하기',
        },
      },
      {
        title: '콜밴팟 모집',
        href: ROUTES.Callvan(),
        Icon: UserAddIcon,
        logging: {
          team: 'CAMPUS',
          event_label: 'category_transportation',
          value: '콜밴팟 모집',
        },
      },
    ],
  },
  {
    title: '기타',
    items: [
      {
        title: '복덕방',
        href: ROUTES.Room(),
        Icon: HomeIcon,
        logging: {
          team: 'BUSINESS',
          event_label: 'category_etc',
          value: '복덕방',
        },
      },
      {
        title: '코인 for Business',
        href: 'https://owner.koreatech.in/',
        Icon: BriefcaseIcon,
        logging: {
          team: 'BUSINESS',
          event_label: 'category_etc',
          value: '코인 for Business',
        },
      },
    ],
  },
];

function CategoryIconBox({ Icon }: { Icon?: IconComponent }) {
  if (!Icon) return null;

  return (
    <IconBox>
      <Icon />
    </IconBox>
  );
}

function CategoryPage() {
  const logger = useLogger();

  const handleCategoryClick = (logging: CategoryLogging) => {
    logger.actionEventClick(logging);
  };

  return (
    <main className={styles.category}>
      <section className={styles.quick} aria-label="주요 서비스">
        {quickMenus.map(({ title, description, href, Icon, logging }) => (
          <Link
            key={title}
            href={href}
            className={styles['quick-card']}
            onClick={() => handleCategoryClick(logging)}
          >
            <CategoryIconBox Icon={Icon} />
            <div>
              <p className={styles['quick-card__title']}>{title}</p>
              <p className={styles['quick-card__description']}>{description}</p>
            </div>
          </Link>
        ))}
      </section>

      {sections.map(({ title, items }) => (
        <section key={title} className={styles.section} aria-labelledby={`category-${title}`}>
          <h2 id={`category-${title}`} className={styles.section__title}>
            {title}
          </h2>
          <ul className={styles.menu}>
            {items.map(({ title: itemTitle, href, Icon, logging }) => (
              <li key={itemTitle}>
                <Link href={href} className={styles.menu__link} onClick={() => handleCategoryClick(logging)}>
                  <div className={styles.menu__content}>
                    <CategoryIconBox Icon={Icon} />
                    <span className={styles.menu__title}>{itemTitle}</span>
                  </div>
                  <ArrowRightIcon className={styles.chevron} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}

CategoryPage.getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;

export default CategoryPage;
