import { Suspense } from 'react';
import CafeteriaSkeleton from 'components/Skeleton/IndexPage/CafeteriaSkeleton';
import NoticeSkeleton from 'components/Skeleton/IndexPage/NoticeSkeleton';
import IndexBus from './components/IndexBus';
import IndexCafeteria from './components/IndexCafeteria';
import IndexNotice from './components/IndexNotice';
import IndexStore from './components/IndexStore';
import IndexTimetable from './components/IndexTimetable';
import styles from './IndexPage.module.scss';

function IndexPage() {
  return (
    <Suspense fallback={null}>
      <main className={styles.template}>
        <div className={styles.mobileWrapper}>
          <IndexStore />
          <IndexBus />
        </div>
        <Suspense fallback={null}>
          <IndexTimetable />
        </Suspense>
        <Suspense fallback={<NoticeSkeleton />}>
          <IndexNotice />
        </Suspense>
        <Suspense fallback={<CafeteriaSkeleton />}>
          <IndexCafeteria />
        </Suspense>
      </main>
    </Suspense>
  );
}

export default IndexPage;
