import { useState, useEffect } from 'react';
import styles from './BenefitRotator.module.scss';

interface BenefitRotatorProps {
  benefits: string[] | string;
}

export default function BenefitRotator({ benefits }: BenefitRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimation, setIsAnimation] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (Array.isArray(benefits) && benefits.length > 1) {
      intervalId = setInterval(() => {
        setIsAnimation(true);
        setTimeout(() => {
          setIsAnimation(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % benefits.length);
        }, 100); // 애니메이션 지속 시간과 동일하게 설정
      }, 4000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [benefits, isAnimation]);

  return (
    <div className={styles['benefit-content']}>
      {Array.isArray(benefits) ? (
        <span className={isAnimation ? styles['benefit-content__fade-in'] : styles['benefit-content__fade-out']}>
          {benefits[currentIndex]}
        </span>
      ) : benefits}
    </div>
  );
}
