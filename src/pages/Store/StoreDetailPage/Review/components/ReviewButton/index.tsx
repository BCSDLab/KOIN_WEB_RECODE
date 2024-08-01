import { createPortal } from 'react-dom';
import LoginRequiredModal from 'components/common/LoginRequiredModal';
import useBooleanState from 'utils/hooks/useBooleanState';
import { useUser } from 'utils/hooks/useUser';
import styles from './index.module.scss';

const REVEIW_LOGIN = [
  '리뷰 작성 시 ',
  '리뷰 작성은 회원만 사용 가능합니다.',
];

export default function ReviewButton({ onClick }: { onClick: ()=> void }) {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const { data: userInfo } = useUser();

  return (
    <>
      <button
        type="button"
        className={styles.container}
        onClick={() => {
          if (userInfo) {
            onClick();
          } else {
            openModal();
          }
        }}
      >
        리뷰 작성하기
      </button>
      {isModalOpen && createPortal(
        <LoginRequiredModal
          title={REVEIW_LOGIN[0]}
          description={REVEIW_LOGIN[1]}
          closeModal={closeModal}
        />,
        document.body,
      )}
    </>
  );
}
