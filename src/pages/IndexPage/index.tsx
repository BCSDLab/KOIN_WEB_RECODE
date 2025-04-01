import { Suspense } from 'react';
import BannerB from 'components/ui/BannerB';
import useBannerCategories from 'components/ui/Banner/hooks/useBannerCategories';
import IndexBus from './components/IndexBus';
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
          <BannerB categoryName={bannerCategory.name} categoryId={bannerCategory.id} />
        </Suspense>
        <div className={styles['mobile-wrapper']}>
          <IndexStore />
          <IndexBus />
        </div>
        <Suspense fallback={null}>
          <IndexTimetable />
        </Suspense>
        <Suspense fallback={null}>
          <IndexArticles />
        </Suspense>
        <Suspense fallback={null}>
          <IndexCafeteria />
        </Suspense>
      </main>
    </Suspense>
  );
}

export default IndexPage;
