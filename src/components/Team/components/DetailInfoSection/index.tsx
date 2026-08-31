import type { ReactNode } from 'react';
import styles from './DetailInfoSection.module.scss';

interface DetailInfoSectionProps {
  label: string;
  children: ReactNode;
}

export default function DetailInfoSection({ label, children }: DetailInfoSectionProps) {
  return (
    <div className={styles.section}>
      <span className={styles.section__label}>{label}</span>
      <div className={styles.section__box}>{children}</div>
    </div>
  );
}
