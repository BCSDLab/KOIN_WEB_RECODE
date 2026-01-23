import CloseIcon from 'assets/svg/Articles/close.svg';
import RefreshIcon from 'assets/svg/Articles/refresh.svg';
import styles from './LostItemFilterModal.module.scss';

interface LostItemFilterModalProps {
  onClose: () => void;
  onReset?: () => void;
  onApply?: () => void;
}

export default function LostItemFilterModal({ onClose, onReset, onApply }: LostItemFilterModalProps) {
  return (
    <div className={styles.modal} role="dialog" aria-label="필터 모달">
      <div className={styles.header}>
        <div className={styles.title}>필터</div>
        <button type="button" className={styles.close} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.label}>목록</div>
        <div className={styles.chips}>
          <button type="button" className={`${styles.chip} ${styles.active}`}>
            전체
          </button>
          <button type="button" className={styles.chip}>
            내 게시물
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 카테고리</div>
        <div className={styles.chips}>
          <button type="button" className={`${styles.chip} ${styles.active}`}>
            전체
          </button>
          <button type="button" className={styles.chip}>
            습득물
          </button>
          <button type="button" className={styles.chip}>
            분실물
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 종류</div>
        <div className={styles.chips}>
          <button type="button" className={`${styles.chip} ${styles.active}`}>
            전체
          </button>
          <button type="button" className={styles.chip}>
            카드
          </button>
          <button type="button" className={styles.chip}>
            신분증
          </button>
          <button type="button" className={styles.chip}>
            지갑
          </button>
          <button type="button" className={styles.chip}>
            전자제품
          </button>
          <button type="button" className={styles.chip}>
            기타
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.label}>물품 상태</div>
        <div className={styles.chips}>
          <button type="button" className={`${styles.chip} ${styles.active}`}>
            전체
          </button>
          <button type="button" className={styles.chip}>
            찾는중
          </button>
          <button type="button" className={styles.chip}>
            찾음
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.reset} onClick={onReset}>
          초기화
          <RefreshIcon />
        </button>
        <button type="button" className={styles.apply} onClick={onApply}>
          적용하기
        </button>
      </div>
    </div>
  );
}
