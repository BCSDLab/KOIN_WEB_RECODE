import Suspense from 'components/ssr/SSRSuspense';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';
import useBannerCategories from 'components/ui/Banner/hooks/useBannerCategories';
import IndexBus from 'components/IndexComponents/IndexBus';
import IndexClub from 'components/IndexComponents/IndexClub';
import IndexCafeteria from 'components/IndexComponents/IndexCafeteria';
import IndexArticles from 'components/IndexComponents/IndexArticles';
import IndexStore from 'components/IndexComponents/IndexStore';
import IndexTimetable from 'components/IndexComponents/IndexTimetable';
import styles from './IndexPage.module.scss';

function Index() {
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

export default Index;
