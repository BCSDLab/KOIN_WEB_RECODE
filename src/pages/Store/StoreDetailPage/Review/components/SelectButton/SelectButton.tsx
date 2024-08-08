import { ReactComponent as Trash } from 'assets/svg/trash-can-icon.svg';
import { ReactComponent as Pen } from 'assets/svg/pen-icon.svg';
import { ReactComponent as Complaint } from 'assets/svg/Review/complaint.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from 'utils/hooks/state/useUser';
import LoginRequiredModal from 'components/common/LoginRequiredModal';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { Portal } from 'components/common/Modal/PortalProvider';
import styles from './SelectButton.module.scss';

interface Props {
  is_mine: boolean;
  review_id: number;
}
const REVEIW_REPORT_LOGIN = [
  '리뷰 신고 시 ',
  '리뷰 신고는 회원만 사용 가능합니다.',
];
export default function SelectButton({ is_mine, review_id }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const { data: userInfo } = useUser();
  const portalManager = useModalPortal();

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal
        title={REVEIW_REPORT_LOGIN[0]}
        description={REVEIW_REPORT_LOGIN[1]}
        closeModal={portalOption.close}
      />
    ));
  };
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
          <button
            type="button"
            className={styles.section}
            onClick={() => {
              if (userInfo) {
                navigate(`/report/review/shopid/${params.id!}/reviewid/${review_id}`);
              } else {
                openLoginModal();
              }
            }}
          >
            신고하기
            {' '}
            <Complaint />
          </button>
        )}
      </div>

    </div>

  );
}
