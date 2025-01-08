import { useParams } from 'react-router-dom';
import LoginRequiredModal from 'components/common/LoginRequiredModal';
import { Portal } from 'components/common/Modal/PortalProvider';

import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import useLogger from 'utils/hooks/analytics/useLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { useUser } from 'utils/hooks/state/useUser';
import styles from './index.module.scss';

export const REVEIW_LOGIN = ['리뷰 작성 시 ', '리뷰 작성은 회원만 사용 가능합니다.'];

export default function ReviewButton({ goReviewPage }: { goReviewPage: () => void }) {
  const { data: userInfo } = useUser();
  const portalManager = useModalPortal();
  const logger = useLogger();
  const params = useParams();
  const { storeDetail } = useStoreDetail(params.id!);

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal
        title={REVEIW_LOGIN[0]}
        description={REVEIW_LOGIN[1]}
        closeModal={portalOption.close}
        type="write"
        shopName={storeDetail.name}
      />
    ));
  };

  const goReviewPageLogging = () => {
    logger.actionEventClick({
      actionTitle: 'BUSINESS',
      title: 'shop_detail_view_review_write',
      event_category: 'click',
      value: storeDetail.name,
    });
    sessionStorage.setItem('enterReview', new Date().getTime().toString());
  };

  return (
    <button
      type="button"
      className={styles.container}
      onClick={() => {
        if (userInfo) {
          goReviewPageLogging();
          goReviewPage();
        } else {
          openLoginModal();
        }
      }}
    >
      리뷰 작성하기
    </button>
  );
}
