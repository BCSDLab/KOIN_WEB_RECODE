import { useEffect, useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@bcsdlab/utils';
import ArrowBackIcon from 'assets/svg/common/arrow-back-icon.svg';
import useGoBack from 'utils/hooks/routing/useGoBack';

import styles from './PageHeader.module.scss';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface PageHeaderProps {
  title: ReactNode;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, onBack, rightAction, className }: PageHeaderProps) {
  const goBack = useGoBack();
  const headerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const rightActionRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
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

  return (
    <div ref={headerRef} className={cn({ [styles.header]: true, [className ?? '']: !!className })}>
      <button
        ref={backButtonRef}
        type="button"
        className={styles['header__back-button']}
        onClick={onBack ?? (() => goBack())}
        aria-label="뒤로가기"
      >
        <ArrowBackIcon />
      </button>
      <h1 className={styles.header__title}>{title}</h1>
      <div ref={rightActionRef} className={styles['header__right-action']}>
        {rightAction ?? <div className={styles.header__spacer} />}
      </div>
    </div>
  );
}
