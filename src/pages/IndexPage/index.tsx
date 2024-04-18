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
      {/* 위 전체적으로 씌워주는 부분에서의 suspense의 사용도와 감을 잘 모르겠음.. */}
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
