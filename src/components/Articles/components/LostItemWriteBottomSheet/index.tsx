'use client';

import Link from 'next/link';
import CloseIcon from 'assets/svg/Articles/close.svg';
import FoundIcon from 'assets/svg/Articles/found.svg';
import LostIcon from 'assets/svg/Articles/lost.svg';
import BottomModal from 'components/ui/BottomModal';
import ROUTES from 'static/routes';
import styles from './LostItemWriteBottomSheet.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFoundClick?: () => void;
  onLostClick?: () => void;
}

export default function LostItemWriteBottomSheet({ isOpen, onClose, onFoundClick, onLostClick }: Props) {
  return (
    <BottomModal isOpen={isOpen} onClose={onClose} className={styles.sheet}>
      <div className={styles.container} role="dialog" aria-label="글쓰기 유형 선택">
        <div className={styles.header}>
          <div className={styles.title}>유형을 선택해 주세요</div>
          <button type="button" className={styles.close} aria-label="닫기" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.body}>
          <Link
            className={styles.option}
            href={ROUTES.LostItemFound()}
            onClick={() => {
              onFoundClick?.();
              onClose();
            }}
          >
            <FoundIcon />
            <span>주인을 찾아요</span>
          </Link>

          <Link
            className={styles.option}
            href={ROUTES.LostItemLost()}
            onClick={() => {
              onLostClick?.();
              onClose();
            }}
          >
            <LostIcon />
            <span>잃어버렸어요</span>
          </Link>
        </div>
      </div>
    </BottomModal>
  );
}
