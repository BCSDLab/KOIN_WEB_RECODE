import Pen from 'assets/svg/pen-icon.svg';
import Complaint from 'assets/svg/Review/complaint.svg';
import Trash from 'assets/svg/trash-can-icon.svg';
import LoginRequiredModal from 'components/common/LoginRequiredModal';
import { Portal } from 'components/common/Modal/PortalProvider';
import { useDeleteReview } from 'pages/Store/StoreDetailPage/hooks/useDeleteReview';
import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import DeleteModal from 'pages/Store/StoreDetailPage/Review/components/DeleteModal/DeleteModal';
import useLogger from 'utils/hooks/analytics/useLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { useUser } from 'utils/hooks/state/useUser';

import showToast from 'utils/ts/showToast';
import ROUTES from 'static/routes';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SelectButton.module.scss';

interface Props {
  is_mine: boolean;
  review_id: number;
  is_reported: boolean | undefined;
}
const REVEIW_REPORT_LOGIN = ['리뷰 신고 시 ', '리뷰 신고는 회원만 사용 가능합니다.'];
export default function SelectButton({ is_mine, review_id, is_reported }: Props) {
  const params = useParams();
  const navigate = useNavigate();
  const portalManager = useModalPortal();
  const param = useParams();
  const mutation = useDeleteReview(param.id!, review_id);
  const logger = useLogger();
  const { storeDetail } = useStoreDetail(params.id!);

  const openDeleteModal = () => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'shop_detail_view_review_delete',
      value: storeDetail.name,
      event_category: 'click',
    });
    portalManager.open((portalOption: Portal) => (
      <DeleteModal
        close={portalOption.close}
        deleteMyReview={mutation.mutate}
        storeDetail={storeDetail}
      />
    ));
  };

  const { data: userInfo } = useUser();

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal
        title={REVEIW_REPORT_LOGIN[0]}
        description={REVEIW_REPORT_LOGIN[1]}
        closeModal={portalOption.close}
        type="report"
        shopName={storeDetail.name}
      />
    ));
  };

  const loggingReportClick = () => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'shop_detail_view_review_report',
      value: storeDetail.name,
      event_category: 'click',
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {is_mine ? (
          <>
            <button
              type="button"
              onClick={() =>
                navigate(ROUTES.ReviewEdit({ id: params.id!, isLink: true }), {
                  state: { from: review_id },
                })
              }
              className={styles.section}
            >
              수정하기
              <Pen />
            </button>
            <button type="button" onClick={openDeleteModal} className={styles.section}>
              삭제하기
              <Trash />
            </button>
          </>
        ) : (
          <button
            type="button"
            className={styles.section}
            onClick={() => {
              if (is_reported) {
                showToast('error', '이미 신고된 리뷰입니다.');
                return;
              }
              if (userInfo) {
                loggingReportClick();
                navigate(
                  ROUTES.ReviewReport({
                    shopid: params.id!,
                    reviewid: String(review_id),
                    isLink: true,
                  })
                );
              } else {
                openLoginModal();
              }
            }}
          >
            신고하기 <Complaint />
          </button>
        )}
      </div>
    </div>
  );
}
