import { useEffect, useRef } from 'react';
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
  const headerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const rightActionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const backButton = backButtonRef.current;
    const rightActionContainer = rightActionRef.current;
    if (!header || !backButton || !rightActionContainer) return;

    const updateSideWidth = () => {
      const sideWidth = Math.max(
        backButton.getBoundingClientRect().width,
        rightActionContainer.getBoundingClientRect().width,
      );
      header.style.setProperty('--header-side-width', `${sideWidth}px`);
    };

    updateSideWidth();

    const resizeObserver = new ResizeObserver(updateSideWidth);
    resizeObserver.observe(backButton);
    resizeObserver.observe(rightActionContainer);

    return () => resizeObserver.disconnect();
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    router.back();
  };

  return (
    <div ref={headerRef} className={cn({ [styles.header]: true, [className ?? '']: !!className })}>
      <button
        ref={backButtonRef}
        type="button"
        className={styles['header__back-button']}
        onClick={handleBack}
        aria-label="뒤로가기"
      >
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
      <div ref={rightActionRef} className={styles['header__right-action']}>
        {rightAction ?? <div className={styles.header__spacer} />}
      </div>
    </div>
  );
}
