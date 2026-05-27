import IndexArticles from 'components/IndexComponents/IndexArticles';
import IndexBus from 'components/IndexComponents/IndexBus';
import IndexCafeteria from 'components/IndexComponents/IndexCafeteria';
import IndexCallvan from 'components/IndexComponents/IndexCallvan';
import IndexLostItem from 'components/IndexComponents/IndexLostItem';
import IndexStore from 'components/IndexComponents/IndexStore';
import IndexTimetable from 'components/IndexComponents/IndexTimetable';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';
import type { HomePageProps } from './types';
import styles from './HomePage.module.scss';

function MobileHomeLegacy({ bannersList, categories, bannerCategoryId }: HomePageProps) {
  return (
    <main className={styles.template}>
      <Banner bannersList={bannersList} bannerCategoryId={bannerCategoryId} />
      <UserInfoModal />
      <div className={styles['left-container']}>
        <IndexStore categories={categories} />
        <IndexBus />
        <IndexCallvan />
        <IndexLostItem />
        <IndexArticles />
      </div>
      <div className={styles['right-container']}>
        <IndexTimetable />
        <IndexCafeteria />
      </div>
    </main>
  );
}

export default MobileHomeLegacy;
