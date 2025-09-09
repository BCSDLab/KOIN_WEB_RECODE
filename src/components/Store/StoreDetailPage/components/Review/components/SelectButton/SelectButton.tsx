import { Portal } from 'components/modal/Modal/PortalProvider';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import DeleteModal from 'components/Store/StoreDetailPage/components/Review/components/DeleteModal/DeleteModal';
import { useDeleteReview } from 'components/Store/StoreDetailPage/hooks/useDeleteReview';
import { useUser } from 'utils/hooks/state/useUser';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';

import showToast from 'utils/ts/showToast';
import useLogger from 'utils/hooks/analytics/useLogger';
import useStoreDetail from 'components/Store/StoreDetailPage/hooks/useStoreDetail';
import ROUTES from 'static/routes';
import { useRouter } from 'next/router';
import styles from './SelectButton.module.scss';

interface Props {
  is_mine: boolean;
  review_id: number;
  is_reported: boolean | undefined;
  store_id: string;
}
const REVEIW_REPORT_LOGIN = [
  '리뷰 신고 시 ',
  '리뷰 신고는 회원만 사용 가능합니다.',
];
export default function SelectButton({
  is_mine, review_id, is_reported, store_id,
}: Props) {
  const router = useRouter();
  const portalManager = useModalPortal();
  const mutation = useDeleteReview(store_id, review_id);
  const logger = useLogger();
  const { storeDetail } = useStoreDetail(store_id);

  const openDeleteModal = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_delete',
      value: storeDetail.name,
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
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_report',
      value: storeDetail.name,
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {is_mine ? (
          <>
            <button
              type="button"
              onClick={() => router.push(
                ROUTES.ReviewEdit({ id: store_id, isLink: true }),
              )}
              className={styles.section}
            >
              수정하기
            </button>
            <button
              type="button"
              onClick={openDeleteModal}
              className={styles.section}
            >
              삭제하기
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
                router.push(ROUTES.ReviewReport({
                  shopid: store_id,
                  reviewid: String(review_id),
                  isLink: true,
                }));
              } else {
                openLoginModal();
              }
            }}
          >
            신고하기
          </button>
        )}
      </div>

    </div>

  );
}
