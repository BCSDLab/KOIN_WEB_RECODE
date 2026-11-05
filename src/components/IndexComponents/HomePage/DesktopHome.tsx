import IndexArticles from 'components/IndexComponents/IndexArticles';
import IndexBus from 'components/IndexComponents/IndexBus';
import IndexCafeteria from 'components/IndexComponents/IndexCafeteria';
import IndexStore from 'components/IndexComponents/IndexStore';
import IndexTimetable from 'components/IndexComponents/IndexTimetable';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';

import HomeGreeting from './HomeGreeting';
import type { HomePageProps } from './types';
import styles from './HomePage.module.scss';

function DesktopHome({ bannersList, serverDining, serverNow, serverSemester }: HomePageProps) {
  return (
    <main className={styles.template}>
      <UserInfoModal />
      <div className={styles.content}>
        <HomeGreeting variant="desktop" />
        <div className={styles['left-container']}>
          <IndexCafeteria serverDining={serverDining} />
          <IndexBus />
          <IndexStore />
          <IndexArticles serverNow={serverNow} />
        </div>
        <div className={styles['right-container']}>
          <IndexTimetable serverSemester={serverSemester} />
          <Banner key={bannersList.banners.map((banner) => banner.id).join('-')} bannersList={bannersList} />
        </div>
      </div>
    </main>
  );
}

export default DesktopHome;
