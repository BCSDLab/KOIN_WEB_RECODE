import type { ReactNode } from 'react';
import { cn } from '@bcsdlab/utils';
import styles from './DetailInfoSection.module.scss';

interface DetailInfoSectionProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export default function DetailInfoSection({ label, children, className }: DetailInfoSectionProps) {
  return (
    <div className={cn({ [styles.section]: true, [className ?? '']: !!className })}>
      <span className={styles.section__label}>{label}</span>
      <div className={styles.section__box}>{children}</div>
    </div>
  );
}
