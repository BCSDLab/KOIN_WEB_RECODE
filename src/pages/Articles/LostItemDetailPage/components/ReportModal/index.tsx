import { createPortal } from 'react-dom';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import CloseIcon from 'assets/svg/Articles/close.svg';
import styles from './ReportModal.module.scss';
// eslint-disable-next-line no-restricted-imports
import ReportForm from '../ReportForm';

interface ReportModalProps {
  articleId: number;
  closeReportModal: () => void;
}

export default function ReportModal({ articleId, closeReportModal }: ReportModalProps) {
  useEscapeKeyDown({ onEscape: closeReportModal });
  useBodyScrollLock();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: closeReportModal });

  return createPortal(
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.modal}>
        <div className={styles['modal__close-Modal']}>
          <button type="button" onClick={closeReportModal} aria-label="닫기">
            <CloseIcon />
          </button>
        </div>
        <ReportForm
          articleId={articleId}
          onClose={closeReportModal}
        />
      </div>
    </div>,
    document.body,
  );
}
