import { Suspense } from 'react';
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
        <div className={styles['mobile-wrapper']}>
          <IndexStore />
          <IndexBus />
        </div>
        <Suspense fallback={null}>
          <IndexTimetable />
        </Suspense>
        <Suspense fallback={null}>
          <IndexNotice />
        </Suspense>
        <Suspense fallback={null}>
          <IndexCafeteria />
        </Suspense>
      </main>
    </Suspense>
  );
}

export default IndexPage;
