// import React from "react";
import { useNavigate } from 'react-router-dom';
import GraduationIcon from 'assets/svg/graduation-icon.svg';
import styles from './GraduationCalculator.module.scss';

function GraudationCalculator() {
  const navigate = useNavigate();
  const onClickCalculator = () => {
    navigate('/graduation');
  };

  return (
    <button
      type="button"
      className={styles['graduation-calculator__button']}
      onClick={onClickCalculator}
    >
      <GraduationIcon />
      졸업학점 계산기
    </button>
  );
}

export default GraudationCalculator;
