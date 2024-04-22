/* eslint-disable no-restricted-imports */
import useVersionInfo from '../../hooks/useVersionInfo';
import styles from '../../DefaultPage/DefaultPage.module.scss';

function LastUpdatedDate() {
  const { data: updatedDate } = useVersionInfo();

  function RefactorDate(date: string) {
    return date.substring(0, 11).replaceAll('-', '. ').replace('T', '.');
  }

  return (
    <div className={styles['page__last-update']}>
      <span className={styles['page__last-update--content']}>마지막 업데이트 날짜:</span>
      <span className={styles['page__last-update--info']}>{RefactorDate(updatedDate.updated_at)}</span>
    </div>
  );
}

export default LastUpdatedDate;
