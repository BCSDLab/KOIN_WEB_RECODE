import { Fragment } from 'react';
import { cn } from '@bcsdlab/utils';
import styles from './StepIndicator.module.scss';

interface StepIndicatorProps {
  steps: string[];
  currentIndex: number;
}

export default function StepIndicator({ steps, currentIndex }: StepIndicatorProps) {
  return (
    <div className={styles.indicator}>
      <div className={styles.indicator__circles}>
        {steps.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && <span className={styles.indicator__line} />}
            <span
              className={cn({
                [styles.indicator__number]: true,
                [styles['indicator__number--current']]: index === currentIndex,
              })}
            >
              {index + 1}
            </span>
          </Fragment>
        ))}
      </div>

      <div className={styles.indicator__labels}>
        {steps.map((step, index) => (
          <span
            key={step}
            className={cn({
              [styles.indicator__label]: true,
              [styles['indicator__label--current']]: index === currentIndex,
            })}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
