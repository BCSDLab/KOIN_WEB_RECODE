import styles from './CreditChart.module.scss';

const credits = [
  {
    course_type: '자유선택',
    total_credit: '10',
    earned_credit: '5',
  },
  {
    course_type: 'HRD필수',
    total_credit: '30',
    earned_credit: '15',
  },
  {
    course_type: 'HRD선택',
    total_credit: '10',
    earned_credit: '3',
  },
  {
    course_type: 'MSC선택',
    total_credit: '10',
    earned_credit: '4',
  },
  {
    course_type: '전공선택',
    total_credit: '20',
    earned_credit: '20',
  },
  {
    course_type: '전공필수',
    total_credit: '45',
    earned_credit: '30',
  },
  {
    course_type: 'MSC필수',
    total_credit: '25',
    earned_credit: '15',
  },
];

function CreditChart() {
  return (
    <div className={styles['credit-chart']}>
      <div className={styles['credit-chart__axis']}>
        {Array.from({ length: 13 }, (_, index) => 60 - index * 5).map((credit) => (
          <div className={styles['credit-chart__row']}>
            <div>{credit}</div>
            <div className={styles['credit-chart__contour']} />
          </div>
        ))}
      </div>
      <div className={styles['credit-chart__x-axis']}>
        {credits.map((credit) => (
          <div className={styles['credit-chart__course']}>
            <div
              style={{ width: '75px', height: `${Number(credit.total_credit) * 5}px` }}
              className={styles['credit-chart__total-credit']}
            >
              <div
                style={{ width: '75px', height: `${Number(credit.earned_credit) * 5}px` }}
                className={styles['credit-chart__earned-credit']}
              />
              <div className={styles['credit-chart__credit-status']}>
                {credit.earned_credit}
                /
                {credit.total_credit}
              </div>
            </div>
            <div className={styles['credit-chart__x-axis--name']}>{credit.course_type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreditChart;
