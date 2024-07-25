import styles from './ReportingLabel.module.scss';

interface ReportingLabelProps {
  title:string;
  description:string;
}

export default function ReportingLabel({ title, description }:ReportingLabelProps) {
  return (
    <div className={styles.label}>
      <div className={styles.label__title}>
        {title}
      </div>
      <div className={styles.label__description}>
        {description}
      </div>
    </div>
  );
}
