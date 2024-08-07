import { ReactComponent as Trash } from 'assets/svg/trash-can-icon.svg';
import { ReactComponent as Pen } from 'assets/svg/pen-icon.svg';
import { ReactComponent as Complaint } from 'assets/svg/Review/complaint.svg';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './SelectButton.module.scss';

interface Props {
  is_mine: boolean;
  review_id: number;
}

export default function SelectButton({ is_mine, review_id }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {is_mine ? (
          <>
            <button
              type="button"
              onClick={() => navigate(
                `/edit/review/${params.id!}`,
                { state: { from: review_id } },
              )}
              className={styles.section}
            >
              수정하기
              <Pen />
            </button>
            <button type="button" className={styles.section}>
              삭제하기
              <Trash />
            </button>
          </>
        ) : (
          <button type="button" className={styles.section}>
            신고하기
            {' '}
            <Complaint />
          </button>
        )}
      </div>

    </div>

  );
}
