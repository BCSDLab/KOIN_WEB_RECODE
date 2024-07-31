import React from 'react';
import { cn } from '@bcsdlab/utils';
import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import { ReactComponent as CheckedIcon } from 'assets/svg/checked-icon.svg';
import { ReactComponent as NotCheckedIcon } from 'assets/svg/not-checked-icon.svg';
import Listbox from 'components/TimetablePage/Listbox';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { useEscapeKey } from 'utils/hooks/ui/useEscapeKey';
import styles from './SemesterSettingModal.module.scss';

export interface SemesterSettingModalProps {
  onClose: () => void
}

export default function SemesterSettingModal({
  onClose,
}: SemesterSettingModalProps) {
  const [isChecked, setIsChecked] = React.useState(false);
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  useEscapeKey({ onEscape: onClose });

  const toggleIsChecked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isChecked) setIsChecked(false);
    else setIsChecked(true);
  };

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
  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <span className={styles.container__title}>학기 설정</span>
          <CloseIcon className={styles['container__close-button']} onClick={onClose} />
        </header>
        <div className={styles.container__semester}>
          <Listbox list={year} value={yearValue} onChange={onChangeYear} version="inModal" />
          <Listbox list={semester} value={semesterValue} onChange={onChangeSemester} version="inModal" />
        </div>
        <div className={styles['container__setting-message']}>
          <button type="button" className={styles.container__checkbox} onClick={toggleIsChecked}>
            {isChecked ? <CheckedIcon /> : <NotCheckedIcon />}
          </button>
          <div className={styles['container__set-default-semester']}>기본 학기로 설정하기</div>
        </div>
        <div className={styles.container__button}>
          <button
            type="button"
            className={cn({
              [styles['container__button--delete']]: true,
            })}
            onClick={onClose}
          >
            삭제하기
          </button>
          <button
            type="button"
            className={cn({
              [styles['container__button--save']]: true,
            })}
            onClick={onClose}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
