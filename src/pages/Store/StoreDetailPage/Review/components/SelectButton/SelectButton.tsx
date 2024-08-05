import { ReactComponent as Trash } from 'assets/svg/trash-can-icon.svg';
import { ReactComponent as Pen } from 'assets/svg/pen-icon.svg';
import { ReactComponent as Complaint } from 'assets/svg/Review/complaint.svg';
import styles from './SelectButton.module.scss';

interface Props {
  is_mine: boolean;
}
export default function SelectButton({ is_mine }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {is_mine ? (
          <>
            <div className={styles.section}>
              수정하기
              <Pen />
            </div>
            <div className={styles.section}>
              삭제하기
              <Trash />
            </div>
          </>
        ) : (
          <div className={styles.section}>
            신고하기
            {' '}
            <Complaint />
          </div>
        )}
      </div>
    </div>
  );
}
