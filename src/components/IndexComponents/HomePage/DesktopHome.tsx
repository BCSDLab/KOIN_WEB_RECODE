import IndexArticles from 'components/IndexComponents/IndexArticles';
import IndexBus from 'components/IndexComponents/IndexBus';
import IndexCafeteria from 'components/IndexComponents/IndexCafeteria';
import IndexCallvan from 'components/IndexComponents/IndexCallvan';
import IndexStore from 'components/IndexComponents/IndexStore';
import IndexTimetable from 'components/IndexComponents/IndexTimetable';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';

import type { HomePageProps } from './types';
import styles from './HomePage.module.scss';

function DesktopHome({
  bannersList,
  categories,
  bannerCategoryId,
  serverDining,
  serverNow,
  serverSemester,
}: HomePageProps) {
  return (
    <main className={styles.template}>
      <Banner bannersList={bannersList} bannerCategoryId={bannerCategoryId} />
      <UserInfoModal />
      <div className={styles.content}>
        <div className={styles['left-container']}>
          <IndexCafeteria serverDining={serverDining} />
          <IndexBus />
          <IndexCallvan />
          <IndexStore categories={categories} />
          <IndexArticles serverNow={serverNow} />
        </div>
        <div className={styles['right-container']}>
          <IndexTimetable serverSemester={serverSemester} />
        </div>
      </div>
    </main>
  );
}

export default DesktopHome;
