import styles from './CompleteConfirmModal.module.scss';

interface CompleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CompleteConfirmModal({ onConfirm, onCancel }: CompleteConfirmModalProps) {
  return (
    <div className={styles.modal__overlay}>
      <button type="button" className={styles.modal__dim} onClick={onCancel} aria-label="닫기" />
      <div className={styles.modal__sheet}>
        <div className={styles['modal__title-area']}>
          <h2 className={styles.modal__title}>이용 완료 상태로 변경할까요?</h2>
        </div>
        <div className={styles.modal__body}>
          <div className={styles.modal__content}>
            <ul className={styles.modal__description}>
              <li>콜밴 이용(탑승, 정산)이 모두 완료된 뒤 눌러야 합니다.</li>
              <li>완료 시 대화 내역이 삭제되며, 되돌릴 수 없습니다.</li>
            </ul>
            <button type="button" className={styles['modal__btn-confirm']} onClick={onConfirm}>
              예
            </button>
            <button type="button" className={styles['modal__btn-cancel']} onClick={onCancel}>
              아니요
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
