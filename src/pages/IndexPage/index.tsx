import { Suspense, useEffect } from 'react';
import { setDurationTime } from 'pages/Store/utils/durationTime';
import IndexBus from './components/IndexBus';
import IndexCafeteria from './components/IndexCafeteria';
import IndexArticles from './components/IndexArticles';
import IndexStore from './components/IndexStore';
import IndexTimetable from './components/IndexTimetable';
import styles from './IndexPage.module.scss';

function IndexPage() {
  useEffect(() => {
    setDurationTime();
  }, []);

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
