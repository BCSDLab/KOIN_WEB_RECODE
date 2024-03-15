import styles from './UserDeleteModal.module.scss';

export interface UserDeleteModalProps {
  deleteUser: () => void
  onClose: () => void
}

export default function UserDeleteModal({
  deleteUser,
  onClose,
}: UserDeleteModalProps) {
  return (
    <div className={styles.background} onClick={() => onClose()} aria-hidden>
      <div className={styles.container}>
        <div className={styles.container__header}>알림!</div>
        <div className={styles.container__content}>해당 계정은 복구가 불가능합니다. 정말 삭제하시겠습니까?</div>
        <div className={styles.container__footer}>
          <button className={styles.button} type="button" onClick={() => deleteUser()}>삭제</button>
        </div>
      </div>
    </div>
  );
}
