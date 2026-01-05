import { cn } from '@bcsdlab/utils';
import styles from './ReportingLabel.module.scss';

interface ReportingLabelProps {
  title: string;
  description: string;
  disable: boolean;
}

export default function ReportingLabel({ title, description, disable }: ReportingLabelProps) {
  return (
    <div className={styles.label}>
      <span className={styles.label__title}>{title}</span>
      {title === '기타' ? (
        <span
          className={cn({
            [styles['etc-description']]: true,
            [styles['etc-description--disable']]: disable,
          })}
        >
          {description}
        </span>
      ) : (
        <div className={styles.label__description}>{description}</div>
      )}
    </div>
  );
}
