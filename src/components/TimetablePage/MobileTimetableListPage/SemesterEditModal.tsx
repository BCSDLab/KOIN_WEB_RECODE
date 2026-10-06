import { useState } from 'react';

import type { Term } from 'api/timetable/entity';
import RadioOffIcon from 'assets/svg/timetable-radio-off.svg';
import RadioOnIcon from 'assets/svg/timetable-radio-on.svg';
import useApplySemesterChanges from 'components/TimetablePage/hooks/useApplySemesterChanges';
import useSemesterCheck from 'components/TimetablePage/hooks/useMySemester';
import useSemestersWithLectures from 'components/TimetablePage/hooks/useSemestersWithLectures';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { getRecentSemester, getSemesterKey } from 'utils/timetable/semester';

import styles from './TimetableModal.module.scss';

type Step = 'year' | 'term' | 'confirm';

interface SemesterEditModalProps {
  onClose: () => void;
}

const TERMS: Term[] = ['1학기', '여름학기', '2학기', '겨울학기'];
const START_YEAR = 2019;

export default function SemesterEditModal({ onClose }: SemesterEditModalProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - START_YEAR + 1 }, (_, index) => currentYear - index);

  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  const { data: mySemester } = useSemesterCheck();
  const semesters = mySemester?.semesters ?? [];
  const { mutate: applyChanges } = useApplySemesterChanges(true);
  const { semestersWithLectures, isLoading } = useSemestersWithLectures(semesters);
  const [step, setStep] = useState<Step>('year');
  const [year, setYear] = useState(() => Math.min(Math.max(getRecentSemester().year, START_YEAR), currentYear));
  const [toggledTerms, setToggledTerms] = useState<Term[]>([]);

  const yearHasLectures = (targetYear: number) =>
    semesters.some((semester) => semester.year === targetYear && semestersWithLectures.has(getSemesterKey(semester)));

  const handleNext = () => {
    setToggledTerms([]);
    setStep('term');
  };

  const toggleTerm = (term: Term) => {
    setToggledTerms((prev) => (prev.includes(term) ? prev.filter((item) => item !== term) : [...prev, term]));
  };

  const existingTerms = semesters.filter((semester) => semester.year === year).map((semester) => semester.term);
  const isChecked = (term: Term) => existingTerms.includes(term) !== toggledTerms.includes(term);
  const toAdd = toggledTerms.filter((term) => !existingTerms.includes(term)).map((term) => ({ year, term }));
  const toRemove = toggledTerms.filter((term) => existingTerms.includes(term)).map((term) => ({ year, term }));
  const needsConfirm = toRemove.some((semester) => semestersWithLectures.has(getSemesterKey(semester)));

  const apply = () => {
    if (toAdd.length > 0 || toRemove.length > 0) applyChanges({ toAdd, toRemove });
    onClose();
  };

  const handleApply = () => {
    if (needsConfirm) {
      setStep('confirm');

      return;
    }
    apply();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      {step === 'year' && (
        <div className={`${styles.container} ${styles['container--semester']}`}>
          <h2 className={styles.heading}>연도 선택</h2>
          <div className={`${styles.options} ${styles['options--scroll']}`} role="radiogroup" aria-label="연도">
            {years.map((item) => (
              <label key={item} className={styles.option}>
                <input
                  type="radio"
                  name="year"
                  className={styles.option__input}
                  checked={year === item}
                  onChange={() => setYear(item)}
                />
                {year === item ? <RadioOnIcon /> : <RadioOffIcon />}
                {item}
                {yearHasLectures(item) && <span className={styles.option__star}>*</span>}
              </label>
            ))}
          </div>
          <div className={styles.buttons}>
            <button type="button" className={`${styles.button} ${styles['button--outline']}`} onClick={onClose}>
              취소하기
            </button>
            <button type="button" className={`${styles.button} ${styles['button--primary']}`} onClick={handleNext}>
              다음
            </button>
          </div>
        </div>
      )}
      {step === 'term' && (
        <div className={`${styles.container} ${styles['container--semester']}`}>
          <h2 className={styles.heading}>학기 추가(중복 가능)</h2>
          <div className={styles.options} role="group" aria-label="학기">
            {TERMS.map((term) => (
              <label key={term} className={styles.option}>
                <input
                  type="checkbox"
                  className={styles.option__input}
                  checked={isChecked(term)}
                  onChange={() => toggleTerm(term)}
                />
                {isChecked(term) ? <RadioOnIcon /> : <RadioOffIcon />}
                {term}
              </label>
            ))}
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.button} ${styles['button--outline']}`}
              onClick={() => setStep('year')}
            >
              이전
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles['button--primary']}`}
              disabled={isLoading}
              onClick={handleApply}
            >
              적용하기
            </button>
          </div>
        </div>
      )}
      {step === 'confirm' && (
        <div className={`${styles.container} ${styles['container--confirm']}`}>
          <p className={styles.message}>
            시간표가 작성되어 있는 학기가 있어요. 해당 학기를 제외할 경우 <strong>학기 내 시간표도 함께 삭제</strong>
            돼요.
          </p>
          <div className={styles.buttons}>
            <button
              type="button"
              className={`${styles.button} ${styles['button--outline']}`}
              onClick={() => setStep('term')}
            >
              취소
            </button>
            <button type="button" className={`${styles.button} ${styles['button--danger']}`} onClick={apply}>
              삭제하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
