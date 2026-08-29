import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import styles from './SubPageHeader.module.scss';

interface SubPageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
  size?: 'small' | 'medium';
}

export default function SubPageHeader({
  title,
  onBack,
  rightAction,
  className,
  size = 'small',
}: SubPageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  };

  return (
    <div className={cn({ [styles.header]: true, [className ?? '']: !!className })}>
      <button type="button" className={styles['header__back-button']} onClick={handleBack} aria-label="뒤로가기">
        <ArrowBackIcon />
      </button>
      <h1
        className={cn({
          [styles.header__title]: true,
          [styles['header__title--medium']]: size === 'medium',
        })}
      >
        {title}
      </h1>
      {rightAction ?? <div className={styles.header__spacer} />}
    </div>
  );
}
