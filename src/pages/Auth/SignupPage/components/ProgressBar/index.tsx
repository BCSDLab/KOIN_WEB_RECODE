import styles from './ProgressBar.module.scss';

interface Steps {
  title: string;
}

interface ProgressBarProps {
  steps: Steps[];
  currentIndex: number
}

/**
 * 사용자에게 여러 단계로 이루어진 프로세스에서 현재 어느 단계에 있는지 시각적으로 보여주는 컴포넌트
 * @param steps Steps[]
 * @param currentStep number
 */
export default function ProgressBar({ steps, currentIndex }: ProgressBarProps) {
  const stepLength = steps.length;
  const progressBarWidthRate = currentIndex < stepLength
  && Number((currentIndex + 1) / stepLength) * 100;

  return (
    <div className={styles.container}>
      <div className={styles['progress-content']}>
        <span>{`${currentIndex + 1}. ${steps[currentIndex].title}`}</span>
        <span>{`${currentIndex + 1} / ${stepLength}`}</span>
      </div>
      <div className={styles['progress-bar-wrapper']}>
        <div className={styles['progress-bar']} style={{ width: `${progressBarWidthRate}%` }} />
      </div>
    </div>
  );
}
