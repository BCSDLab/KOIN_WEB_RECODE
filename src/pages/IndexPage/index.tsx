import { Suspense } from 'react';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';
import useBannerCategories from 'components/ui/Banner/hooks/useBannerCategories';
import IndexBus from './components/IndexBus';
import IndexClub from './components/IndexClub';
import IndexCafeteria from './components/IndexCafeteria';
import IndexArticles from './components/IndexArticles';
import IndexStore from './components/IndexStore';
import IndexTimetable from './components/IndexTimetable';
import styles from './IndexPage.module.scss';

function IndexPage() {
  const bannerCategory = (useBannerCategories() || [])[0];

  return (
    <Suspense fallback={null}>
      <main className={styles.template}>
        <Suspense fallback={null}>
          <Banner categoryId={bannerCategory.id} />
        </Suspense>
        <Suspense fallback={null}>
          <UserInfoModal />
        </Suspense>
        <div className={styles['left-container']}>
          <IndexStore />
          <IndexBus />
          <IndexClub />
          <Suspense fallback={null}>
            <IndexArticles />
          </Suspense>
        </div>
        <div className={styles['right-container']}>
          <Suspense fallback={null}>
            <IndexTimetable />
          </Suspense>
          <Suspense fallback={null}>
            <IndexCafeteria />
          </Suspense>
        </div>
      </main>
    </Suspense>
  );
}

export default IndexPage;
