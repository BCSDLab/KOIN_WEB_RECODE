import { useEffect, useRef } from 'react';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import ClubSearchContainer from 'pages/Club/ClubListPage/components/ClubSearchContainer';
import styles from './ClubSearchBarModal.module.scss';

interface ClubSearchBarModalProps {
  onClose: () => void;
}

export default function ClubSearchBarModal({ onClose }: ClubSearchBarModalProps) {
  const clubRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKeyDown({ onEscape: onClose });

  useEffect(() => {
    clubRef.current?.focus();
  }, []);

  return (
    <div className={styles['search-bar-modal__background']} ref={backgroundRef}>
      <div
        ref={containerRef}
        className={styles['search-bar-modal__container']}
      >
        <ClubSearchContainer onClose={onClose} />
      </div>
    </div>
  );
}
