import { cn } from '@bcsdlab/utils';
import styles from './ReportingLabel.module.scss';

interface ReportingLabelProps {
  title:string;
  description:string;
  active: boolean;
}

export default function ReportingLabel({ title, description, active }:ReportingLabelProps) {
  return (
    <div className={styles.label}>
      <span className={styles.label__title}>
        {title}
      </span>
      {title === '기타' ? (
        <span className={cn({
          [styles['etc-description']]: true,
          [styles['etc-description--active']]: active,
        })}
        >
          {description}
        </span>
      ) : (
        <div className={styles.label__description}>
          {description}
        </div>
      )}
    </div>
  );
}
