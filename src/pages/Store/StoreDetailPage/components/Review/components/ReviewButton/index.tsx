import { Portal } from 'components/modal/Modal/PortalProvider';
import LoginRequired from 'components/modal/LoginRequired';

import { useUser } from 'utils/hooks/state/useUser';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useLogger from 'utils/hooks/analytics/useLogger';
import { useParams } from 'react-router-dom';
import useStoreDetail from 'pages/Store/StoreDetailPage/hooks/useStoreDetail';
import styles from './index.module.scss';

export const REVEIW_LOGIN = [
  '리뷰를 작성하기 ',
  '리뷰 작성은 회원만 사용 가능합니다.',
];

export default function ReviewButton({ goReviewPage }: { goReviewPage: ()=> void }) {
  const { data: userInfo } = useUser();
  const portalManager = useModalPortal();
  const logger = useLogger();
  const params = useParams();
  const { storeDetail } = useStoreDetail(params.id!);

  const openLoginModal = () => {
    const loggingLoginClick = () => {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_review_write_login',
        value: storeDetail.name,
      });
    };
    const loggingCancelClick = () => {
      logger.actionEventClick({
        team: 'BUSINESS',
        event_label: 'shop_detail_view_review_write_cancel',
        value: storeDetail.name,
      });
    };
    portalManager.open((portalOption: Portal) => (
      <LoginRequired
        title={REVEIW_LOGIN[0]}
        description={REVEIW_LOGIN[1]}
        onClose={portalOption.close}
        onLoginClick={loggingLoginClick}
        onCancelClick={loggingCancelClick}
      />
    ));
  };

  const goReviewPageLogging = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view_review_write',
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
