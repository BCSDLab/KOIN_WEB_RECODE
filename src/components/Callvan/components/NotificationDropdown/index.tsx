import { useEffect, useRef } from 'react';
import styles from './NotificationDropdown.module.scss';

interface NotificationDropdownProps {
  onMarkAllRead: () => void;
  onDeleteAll: () => void;
  onClose: () => void;
}

export default function NotificationDropdown({ onMarkAllRead, onDeleteAll, onClose }: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <button
        type="button"
        className={styles.dropdown__item}
        onClick={() => {
          onMarkAllRead();
          onClose();
        }}
      >
        모두 읽음으로 표시
      </button>
      <div className={styles.dropdown__divider} />
      <button
        type="button"
        className={`${styles.dropdown__item} ${styles['dropdown__item--danger']}`}
        onClick={() => {
          onDeleteAll();
          onClose();
        }}
      >
        알림 전체 삭제
      </button>
    </div>
  );
}
