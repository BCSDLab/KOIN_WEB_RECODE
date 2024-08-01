import { ReactComponent as Trash } from 'assets/svg/trash-can-icon.svg';
import { ReactComponent as Pen } from 'assets/svg/pen-icon.svg';
import { ReactComponent as Complaint } from 'assets/svg/Review/complaint.svg';
import { useNavigate } from 'react-router-dom';
import styles from './SelectButton.module.scss';

interface Props {
  is_mine: boolean;
  shop_id: string;
  review_id: number;
}

export default function SelectButton({ is_mine, shop_id, review_id }: Props) {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      {is_mine ? (
        <>
          <button className={styles.section} type="button">
            수정하기
            <Pen />
          </button>
          <button className={styles.section} type="button">
            삭제하기
            <Trash />
          </button>
        </>
      ) : (
        <div className={styles.section}>
          <button
            className={styles['report-button']}
            type="button"
            onClick={() => navigate(`/report/review/shopid/${shop_id}/reviewid/${review_id}`)}
          >
            신고하기
            {' '}
            <Complaint />
          </button>
        </div>
      )}
    </div>
  );
}
