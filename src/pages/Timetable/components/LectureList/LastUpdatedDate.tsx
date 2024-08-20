import useVersionInfo from 'pages/Timetable/hooks/useVersionInfo';
import styles from './LectureList.module.scss';

function LastUpdatedDate() {
  const { data: updatedDate } = useVersionInfo();

  function RefactorDate(date: string) {
    return date.substring(0, 11).replaceAll('-', '.').replace('T', '.');
  }

  return (
    <div className={styles['page__last-update']}>
      {`최근 업데이트 : ${RefactorDate(updatedDate.updated_at)}`}
    </div>
  );
}

export default LastUpdatedDate;
