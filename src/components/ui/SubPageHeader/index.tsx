import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import styles from './SubPageHeader.module.scss';

interface SubPageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export default function SubPageHeader({ title, onBack, rightAction }: SubPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  };

  return (
    <div className={styles.header}>
      <button type="button" className={styles['header__back-button']} onClick={handleBack} aria-label="뒤로가기">
        <ArrowBackIcon />
      </button>
      <h1 className={styles.header__title}>{title}</h1>
      {rightAction ?? <div className={styles.header__spacer} />}
    </div>
  );
}
