import { useEffect } from 'react';
import { RestrictedCallvanResponse } from 'api/callvan/entity';
import { getCallvanRestrictionModalCopy } from 'components/Callvan/utils/callvanRestriction';
import { useBodyScrollLock } from 'utils/hooks/ui/useBodyScrollLock';
import styles from './CallvanRestrictionModal.module.scss';

interface CallvanRestrictionModalProps {
  restriction: RestrictedCallvanResponse | null;
  onClose: () => void;
}

export default function CallvanRestrictionModal({ restriction, onClose }: CallvanRestrictionModalProps) {
  useBodyScrollLock();

  const { titleAccent, titleRest, descriptionLines } = getCallvanRestrictionModalCopy(restriction);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={styles.modal__overlay} role="dialog" aria-modal="true" aria-labelledby="callvan-restriction-title">
      <button type="button" className={styles.modal__dim} onClick={onClose} aria-label="닫기" />
      <div className={styles.modal__sheet}>
        <div className={styles.modal__content}>
          <div className={styles.modal__text}>
            <h2 id="callvan-restriction-title" className={styles.modal__title}>
              <span className={styles.modal__accent}>{titleAccent}</span>
              {titleRest}
            </h2>
            <div className={styles.modal__description}>
              {descriptionLines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
            </div>
          </div>
          <button type="button" className={styles.modal__button} onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
