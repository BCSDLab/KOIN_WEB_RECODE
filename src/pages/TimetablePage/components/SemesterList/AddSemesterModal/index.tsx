import React from 'react';
import { cn } from '@bcsdlab/utils';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import Listbox from 'components/TimetablePage/Listbox';
import { AddTimetableFrameRequest, SemesterCheckResponse, TimetableFrameInfo } from 'api/timetable/entity';
import showToast from 'utils/ts/showToast';
import { UseMutateFunction } from '@tanstack/react-query';
import styles from './AddSemesterModal.module.scss';

export interface AddSemesterModalProps {
  onClose: () => void;
  setModalOpenFalse: () => void;
  addSemester:
  UseMutateFunction<TimetableFrameInfo, unknown, AddTimetableFrameRequest, unknown>;
  mySemester: SemesterCheckResponse | null;
}

export default function AddSemesterModal({
  onClose,
  setModalOpenFalse,
  addSemester,
  mySemester,
}: AddSemesterModalProps) {
  /* 학기 API 완성 시 수정 예정 */
  const year = [{ label: '2024년도', value: '2024년도' },
    { label: '2023년도', value: '2023년도' },
    { label: '2022년도', value: '2022년도' },
    { label: '2021년도', value: '2021년도' },
    { label: '2020년도', value: '2020년도' },
    { label: '2019년도', value: '2019년도' }];
  const semester = [{ label: '겨울학기', value: '겨울학기' },
    { label: '2학기', value: '2학기' },
    { label: '여름학기', value: '여름학기' },
    { label: '1학기', value: '1학기' }];
  const [yearValue, setYearValue] = React.useState(year[0].label);
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
      if (mySemester.semesters.includes(semesters.semester)) {
        showToast('info', '이미 있는 학기입니다.');
      } else {
        addSemester(semesters);
        closeModal();
      }
    }
  };
  const semesterParam = yearValue.replace('년도', '') + (semesterValue.length === 3 ? '' : '-') + semesterValue.replace('학기', '');

  return (
    <div className={styles.background}>
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
          <Listbox list={year} value={yearValue} onChange={onChangeYear} version="inModal" />
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
            onClick={() => handleAddSemester({ semester: semesterParam })}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
