import { Portal } from 'components/common/Modal/PortalProvider';
import LoginRequiredModal from 'components/common/LoginRequiredModal';

import { useUser } from 'utils/hooks/state/useUser';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { ReactComponent as Pen } from 'assets/svg/pen-icon.svg';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './index.module.scss';

export const REVEIW_LOGIN = [
  '리뷰 작성 시 ',
  '리뷰 작성은 회원만 사용 가능합니다.',
];

export default function ReviewButton({ goReviewPage }: { goReviewPage: ()=> void }) {
  const { data: userInfo } = useUser();
  const portalManager = useModalPortal();
  const isMobile = useMediaQuery();

  const openLoginModal = () => {
    portalManager.open((portalOption: Portal) => (
      <LoginRequiredModal
        title={REVEIW_LOGIN[0]}
        description={REVEIW_LOGIN[1]}
        closeModal={portalOption.close}
      />
    ));
  };

  return (
    <button
      type="button"
      className={styles.container}
      onClick={() => {
        if (userInfo) {
          goReviewPage();
        } else {
          openLoginModal();
        }
      }}
    >
      리뷰 작성하기
      {' '}
      {!isMobile && <Pen style={{ width: '18px' }} />}
    </button>
  );
}
