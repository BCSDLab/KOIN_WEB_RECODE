import { Suspense } from 'react';
import IndexBus from './components/IndexBus';
import IndexCafeteria from './components/IndexCafeteria';
import IndexNotice from './components/IndexNotice';
import IndexStore from './components/IndexStore';
import IndexTimetable from './components/IndexTimetable';
import styles from './IndexPage.module.scss';

function IndexPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* 위 전체적으로 씌워주는 부분에서의 suspense의 위치를
      조율하는 방향으로 수정 필요 예상 */}
      <main className={styles.template}>
        <div className={styles.mobileWrapper}>
          <IndexStore />
          <IndexBus />
        </div>
        <IndexTimetable />
        <IndexNotice />
        <IndexCafeteria />
      </main>
    </Suspense>
  );
}

export default IndexPage;
