import { useState, useEffect } from 'react';
import styles from './BenefitRotator.module.scss';

interface BenefitRotatorProps {
  benefits: string[] | string;
}

function BenefitRotator({ benefits }: BenefitRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (Array.isArray(benefits) && benefits.length > 1) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % benefits.length);
      }, 4000);

      return () => clearInterval(intervalId);
    }

    return undefined;
  }, [benefits]);

  return (
    <div className={styles['benefit-content']}>
      {Array.isArray(benefits) ? benefits[currentIndex] : benefits}
    </div>
  );
}

export default BenefitRotator;
