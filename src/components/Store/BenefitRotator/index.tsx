import { useState, useEffect } from 'react';
import styles from './BenefitRotator.module.scss';

interface BenefitRotatorProps {
  benefits:string[];
}
function BenefitRotator({ benefits }:BenefitRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (benefits.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % benefits.length);
      }, 4000);

      return () => clearInterval(intervalId);
    }
    return undefined;
  }, [benefits]);

  if (benefits.length === 0) return null;

  return (
    <div className={styles['benefit-content']}>
      {benefits[currentIndex]}
    </div>
  );
}

export default BenefitRotator;
