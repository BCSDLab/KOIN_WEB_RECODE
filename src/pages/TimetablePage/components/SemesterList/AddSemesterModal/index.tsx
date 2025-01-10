import React from 'react';
import { cn } from '@bcsdlab/utils';
import CloseIcon from 'assets/svg/common/close/close-icon-black.svg';
import Listbox from 'components/TimetablePage/Listbox';
import {
  AddTimetableFrameRequest, SemesterCheckResponse, Term, TimetableFrameListResponse,
} from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import { UseMutateFunction } from '@tanstack/react-query';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import styles from './AddSemesterModal.module.scss';

export interface AddSemesterModalProps {
  onClose: () => void;
  setModalOpenFalse: () => void;
  addSemester:
  UseMutateFunction<TimetableFrameListResponse, unknown, AddTimetableFrameRequest, unknown>;
  mySemester: SemesterCheckResponse | null;
}

const currentYear = new Date().getFullYear();
const startYear = 2019;
const years = Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
  const year = currentYear - index;
  return { label: `${year}년도`, value: `${year}년도` };
});

const semester = [
  { label: '겨울학기', value: '겨울학기' },
  { label: '2학기', value: '2학기' },
  { label: '여름학기', value: '여름학기' },
  { label: '1학기', value: '1학기' },
];

export default function AddSemesterModal({
  onClose,
  setModalOpenFalse,
  addSemester,
  mySemester,
}: AddSemesterModalProps) {
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const [yearValue, setYearValue] = React.useState(years[0].label);
  const [semesterValue, setSemesterValue] = React.useState(semester[0].label);

  const onChangeYear = (e: { target: { value: string } }) => {
    const { target } = e;
    setYearValue(target?.value);
  };
  const onChangeSemester = (e: { target: { value: string } }) => {
    const { target } = e;
    setSemesterValue(target?.value);
  };
  const closeModal = () => {
    setModalOpenFalse();
    onClose();
  };
  const handleAddSemester = (semesters: AddTimetableFrameRequest) => {
    if (mySemester) {
      if (mySemester.semesters.some(
        (semes) => semes.year === semesters.year && semes.term === semesters.term,
      )
      ) {
        showToast('info', '이미 있는 학기입니다.');
      } else {
        addSemester(semesters);
        closeModal();
      }
    }
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <span className={styles.container__title}>학기 추가</span>
          <div
            className={styles['container__close-button']}
            onClick={closeModal}
            role="button"
            aria-hidden
          >
            <CloseIcon />
          </div>
        </header>
        <div className={styles.container__semester}>
          <Listbox list={years} value={yearValue} onChange={onChangeYear} version="inModal" />
          <Listbox list={semester} value={semesterValue} onChange={onChangeSemester} version="inModal" />
        </div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={cn({
              [styles['container__button--delete']]: true,
            })}
            onClick={closeModal}
          >
            취소하기
          </button>
          <button
            type="button"
            className={cn({
              [styles['container__button--save']]: true,
            })}
            onClick={() => handleAddSemester({ year: Number(yearValue.replace('년도', '')), term: semesterValue as Term })}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
