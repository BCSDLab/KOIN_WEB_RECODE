import { startTransition, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@bcsdlab/utils';
import useTokenState from 'utils/hooks/state/useTokenState';
import useCalculateCredits from 'components/GraduationCalculatorPage/hooks/useCalculateCredits';
import { GradesByCourseType } from 'api/graduationCalculator/entity';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import { Portal } from 'components/modal/Modal/PortalProvider';
import useGetMultiMajorLecture from 'components/TimetablePage/hooks/useGetMultiMajorLecture';
import { useScrollLock } from 'utils/hooks/ui/useScrollLock';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from './CreditChart.module.scss';
import SemesterLectureListModal from './SemesterLectureListModal';

function CreditChart({ totalGrades }: { totalGrades: number }) {
  const logger = useLogger();
  const { lock, unlock } = useScrollLock(false);
  const portalManger = useModalPortal();
  const token = useTokenState();
  const { data: calculateCredits } = useCalculateCredits(token);
  const { data: multiMajorLecture } = useGetMultiMajorLecture(token);
  const [creditState, setCreditState] = useState<GradesByCourseType[]>([]);
  const barsNumber = creditState.length;
  const onClickBar = (courseType: string) => {
    logger.actionEventClick({
      team: 'USER',
      event_label: 'graduation_calculator_lectures_list',
      value: `강의 개설 목록_${courseType}`,
    });
    lock();
    startTransition(() =>
      portalManger.open((portalOption: Portal) => (
        <SemesterLectureListModal
          onClose={() => {
            portalOption.close();
            unlock();
          }}
          initialCourse={courseType}
        />
      )),
    );
  };

  const updateValues = (newValues: GradesByCourseType[]) => {
    setCreditState(newValues);
  };
  const multiMajorGrades = multiMajorLecture
    ? multiMajorLecture.reduce((acc, curr) => acc + Number(curr.grades), 0)
    : null;

  useEffect(() => {
    if (calculateCredits) {
      updateValues([
        ...calculateCredits.course_types,
        ...(multiMajorGrades
          ? [
              {
                courseType: '다전공',
                requiredGrades: 0,
                grades: multiMajorGrades,
              },
            ]
          : []),
      ]);
    }
  }, [calculateCredits, multiMajorGrades]);

  return (
    <div className={styles['credit-chart']}>
      <div className={styles['credit-chart__total-grades']}>{`총 학점: ${totalGrades}`}</div>
      <div className={styles['credit-chart__y-axis']}>
        {Array.from({ length: 13 }, (_, index) => 60 - index * 5).map((credit, idx) => (
          <div key={`y-axis-${idx}`} className={styles['credit-chart__y-axis--value']}>
            <div>{credit}</div>
            <div className={styles['credit-chart__contour']} />
          </div>
        ))}
      </div>
      <motion.div
        layout
        className={styles['credit-chart__x-axis']}
        style={{ gridTemplateColumns: `repeat(${barsNumber}, 1fr)` }}
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
              onClick={() => onClickBar(credit.courseType)}
            >
              <div
                style={{
                  height: `${Number(credit.requiredGrades) * 5}px`,
                }}
                className={styles['credit-chart__total-credit']}
              >
                <motion.div
                  style={{
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
                  {`${credit.grades} ${credit.requiredGrades ? `/ ${credit.requiredGrades}` : ''}`}
                </div>
              </div>
              <div className={styles['credit-chart__x-axis--name']}>{credit.courseType}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div className={styles['credit-chart__description']}>다전공은 학점계산에 적용되지 않아요.</div>
    </div>
  );
}

export default CreditChart;
