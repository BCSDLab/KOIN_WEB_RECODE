import IndexBus from './components/IndexBus';
import IndexCafeteria from './components/IndexCafeteria';
import IndexNotice from './components/IndexNotice';
import IndexStore from './components/IndexStore';
import IndexTimetable from './components/IndexTimetable';
import styles from './IndexPage.module.scss';

function IndexPage() {
  return (
    <main className={styles.template}>
      <IndexStore />
      <IndexTimetable />
      <IndexBus />
      <IndexNotice />
      <IndexCafeteria />
    </main>
  );
}

export default IndexPage;
