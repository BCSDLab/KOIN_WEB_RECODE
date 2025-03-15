import { useEffect } from 'react';
import styles from './index.module.scss';

interface ToastProps {
  close: () => void;
  message: string;
  ms?: number; // defaultValue 명시 했음
}

export default function KoinToast({ close, message, ms = 3000 }: ToastProps) {
  useEffect(() => {
    const id = setTimeout(close, ms);

    return () => clearTimeout(id);
  }, [close, ms]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {message}
      </div>
    </div>
  );
}
