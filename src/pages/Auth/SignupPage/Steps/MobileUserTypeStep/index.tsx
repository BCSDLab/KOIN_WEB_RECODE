import styles from './MobileUserTypeStep.module.scss';

type UserType = '학생' | '외부인';

interface MobileUserTypeStepProps {
  onSelectType: (type: UserType) => void;
}

function MobileUserTypeStep({ onSelectType }: MobileUserTypeStepProps) {
  return (
    <div className={styles.container}>
      <div className={styles.box} />
      <div className={styles['button-container']}>
        <button className={`${styles['button-container__button']} ${styles['button-container__button--orange']}`} type="button" onClick={() => onSelectType('학생')}>
          한국기술교육대학교 학생
        </button>
        <button className={`${styles['button-container__button']} ${styles['button-container__button--blue']}`} type="button" onClick={() => onSelectType('외부인')}>
          외부인
        </button>
      </div>
    </div>
  );
}

export default MobileUserTypeStep;
