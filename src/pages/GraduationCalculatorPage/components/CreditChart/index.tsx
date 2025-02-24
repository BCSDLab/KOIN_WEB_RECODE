import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@bcsdlab/utils';
import useMyLectures from 'pages/TimetablePage/hooks/useMyLectures';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import useCalculateCredits from 'pages/GraduationCalculatorPage/hooks/useCalculateCredits';
import styles from './CreditChart.module.scss';
import SemesterLectureListModal from './SemesterLectureListModal';

const barStyles = (barsNumber: number) => {
  if (barsNumber === 7) return { width: '75px', gap: '45px' };
  if (barsNumber === 8) return { width: '70px', gap: '33.57px' };
  if (barsNumber === 9) return { width: '65px', gap: '26.25px' };
  if (barsNumber === 10) return { width: '60px', gap: '21.67px' };
  return { width: '70px', gap: '33.57px' };
};

function CreditChart({ currentFrameIndex }: { currentFrameIndex: number }) {
  const myLectures = useMyLectures(currentFrameIndex);
  const token = useTokenState();
  const { data: calculateCredits } = useCalculateCredits(token);
  const [creditState, setCreditState] = useState<typeof calculateCredits.course_types>([]);
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const barsNumber = creditState.length;

  const updateValues = (newValues: typeof calculateCredits.course_types) => {
    setCreditState(newValues);
  };

  const openSemesterLectureListModal = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    openModal();
  };

  useEffect(() => {
    const result = calculateCredits.course_types;
    updateValues(result);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myLectures]);

  return (
    <div className={styles['credit-chart']}>
      <div className={styles['credit-chart__y-axis']}>
        {Array.from({ length: 13 }, (_, index) => 60 - index * 5).map(
          (credit, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={`y-axis-${idx}`} className={styles['credit-chart__y-axis--value']}>
              <div>{credit}</div>
              <div className={styles['credit-chart__contour']} />
            </div>
          ),
        )}
      </div>
      <motion.div
        layout
        className={styles['credit-chart__x-axis']}
        style={{ gap: barStyles(barsNumber).gap }}
      >
        <AnimatePresence>
          {creditState.map((credit) => (
            <motion.div
              key={credit.courseType}
              className={styles['credit-chart__course']}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              layout
              onClick={openSemesterLectureListModal}
            >
              <div
                style={{
                  width: barStyles(barsNumber).width,
                  height: `${Number(credit.requiredGrades) * 5}px`,
                }}
                className={styles['credit-chart__total-credit']}
              >
                <motion.div
                  style={{
                    width: barStyles(barsNumber).width,
                    height: `${Number(credit.grades) * 5}px`,
                  }}
                  className={cn({
                    [styles['credit-chart__earned-credit']]: true,
                    [styles['credit-chart__earned-credit--full']]: credit.requiredGrades - credit.grades < 2,
                  })}
                  initial={{ height: '0%' }}
                  animate={{ height: `${credit.grades * 5}px` }}
                  transition={{ duration: 0.5 }}
                  layout
                />
                <div className={styles['credit-chart__credit-status']}>
                  {`${credit.grades} / ${credit.requiredGrades}`}
                </div>
              </div>
              <div className={styles['credit-chart__x-axis--name']}>
                {credit.courseType}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {
        isModalOpen && (
          <SemesterLectureListModal
            onClose={closeModal}
          />
        )
      }
    </div>
  );
}

export default CreditChart;
