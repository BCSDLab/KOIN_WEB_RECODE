import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@bcsdlab/utils';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import styles from './CreditChart.module.scss';

const initialCredits = [
  {
    courseType: '자유선택',
    requireGrades: '10',
    grades: '5',
  },
  {
    courseType: 'HRD필수',
    requireGrades: '30',
    grades: '15',
  },
  {
    courseType: 'HRD선택',
    requireGrades: '10',
    grades: '3',
  },
  {
    courseType: 'MSC선택',
    requireGrades: '10',
    grades: '4',
  },
  {
    courseType: '전공선택',
    requireGrades: '20',
    grades: '20',
  },
  {
    courseType: '전공필수',
    requireGrades: '45',
    grades: '30',
  },
  {
    courseType: 'MSC필수',
    requireGrades: '25',
    grades: '15',
  },
];

function CreditChart({ currentFrameIndex }: { currentFrameIndex: number }) {
  const myLectures = useMyLectures(currentFrameIndex);
  const [creditState, setCreditState] = useState(initialCredits);

  const updateValues = (newValues: typeof initialCredits) => {
    setCreditState(newValues);
  };

  // api 정상화되면 삭제 예정
  const handleUpdate = () => {
    let newValues = [...creditState];

    // 10% 확률로 막대 하나 삭제 및 추가(최소 1개 유지) -> api 정상화 되면 삭제 예정
    if (Math.random() < 0.5 && newValues.length > 1) {
      newValues.splice(newValues.length - 1, 1);
    } else if (Math.random() > 0.6) {
      newValues.push({
        courseType: `추가과목${newValues.length + 1}`,
        requireGrades: String(Math.floor(Math.random() * 30) + 10),
        grades: '0',
      });
    }

    // 기존 막대 일부 값 변경 -> api 정상화 되면 삭제 예정
    newValues = newValues.map((credit) => ({
      ...credit,
      grades:
        Math.random() > 0.5
          ? String(Math.floor(Math.random() * Number(credit.requireGrades)))
          : credit.grades,
    }));

    updateValues(newValues);
  };

  useEffect(() => {
    // result = 이수 구분 별 학점 계산 함수 추가
    // updateValues(result)
  }, [myLectures]);

  return (
    <div className={styles['credit-chart']}>
      <div className={styles['credit-chart__axis']}>
        {Array.from({ length: 13 }, (_, index) => 60 - index * 5).map(
          (credit, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={idx} className={styles['credit-chart__row']}>
              <div>{credit}</div>
              <div className={styles['credit-chart__contour']} />
            </div>
          ),
        )}
      </div>
      <motion.div layout className={styles['credit-chart__x-axis']}>
        <AnimatePresence>
          {creditState.map((credit, index) => (
            <motion.div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={styles['credit-chart__course']}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              layout
            >
              <div
                style={{
                  width: '75px',
                  height: `${Number(credit.requireGrades) * 5}px`,
                }}
                className={styles['credit-chart__total-credit']}
              >
                <motion.div
                  style={{
                    width: '75px',
                    height: `${Number(credit.grades) * 5}px`,
                  }}
                  initial={{ height: '0%' }}
                  animate={{ height: `${Number(credit.grades) * 5}px` }}
                  transition={{ duration: 0.5 }}
                  className={
                  cn({
                    [styles['credit-chart__earned-credit']]: true,
                    [styles['credit-chart__earned-credit--full']]: Number(credit.requireGrades) - Number(credit.grades) < 2,
                  })
                }
                  layout
                />
                <div className={styles['credit-chart__credit-status']}>
                  {credit.grades}
                  {' '}
                  /
                  {credit.requireGrades}
                </div>
              </div>
              <div className={styles['credit-chart__x-axis--name']}>
                {credit.courseType}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* 테스트용 */}
      <button
        type="button"
        style={{ border: '1px solid black' }}
        onClick={handleUpdate}
      >
        값 변경 (추가/삭제 포함)
      </button>
    </div>
  );
}

export default CreditChart;
