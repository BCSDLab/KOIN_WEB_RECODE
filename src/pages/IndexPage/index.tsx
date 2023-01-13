import styles from './IndexPage.module.scss';
import IndexBus from './components/IndexBus';
import IndexCafeteria from './components/IndexCafeteria';
import IndexNotice from './components/IndexNotice';
import IndexStore from './components/IndexStore';
import IndexTimetable from './components/IndexTimetable';

function IndexPage() {
  return (
    <main className={styles.template}>
      <IndexStore />
      <IndexCafeteria />
      <IndexTimetable />
      <IndexBus />
      <IndexNotice />
    </main>
  );
}

export default IndexPage;
