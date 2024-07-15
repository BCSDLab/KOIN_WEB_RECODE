/* eslint-disable no-restricted-imports */
import React, { useState } from 'react';
import { cn } from '@bcsdlab/utils';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import Listbox from 'components/TimetablePage/Listbox';
import useBooleanState from 'utils/hooks/useBooleanState';
import useLogger from 'utils/hooks/useLogger';
import { ReactComponent as DownArrowIcon } from 'assets/svg/down-arrow-icon.svg';
import { ReactComponent as UpArrowIcon } from 'assets/svg/up-arrow-icon.svg';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import { ReactComponent as TrashCanIcon } from 'assets/svg/trash-can-icon.svg';
import useOnClickOutside from 'utils/hooks/useOnClickOutside';
import useSemesterOptionList from 'pages/Timetable/hooks/useSemesterOptionList';
import useGetTimetableFrame from 'pages/Timetable/hooks/useGetTimetableFrame';
import useTokenState from 'utils/hooks/useTokenState';
import SemesterSettingModal from './SemesterSettingModal';
import styles from './SemesterList.module.scss';

function SemesterListbox() {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const logger = useLogger();
  const handleToggleListBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };
  const semester = useSemester();
  const { updateSemester } = useSemesterAction();
  const [semesterValue, setSemesterValue] = useState(semester);
  const token = useTokenState();
  const { data: timetableFrame } = useGetTimetableFrame(token, semester);
  const onChangeSelect = (e: { target: { value: string } }) => {
    const { target } = e;
    updateSemester(target?.value);
    setSemesterValue(target?.value);
  };
  console.log(timetableFrame);
  const semesterOptionList = useSemesterOptionList();
  React.useEffect(() => {
    onChangeSelect({ target: { value: semesterOptionList[0].value } });
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    onChangeSelect({ target: { value: optionValue ?? '' } });
    logger.actionEventClick({ actionTitle: 'USER', title: 'select_semester', value: semesterValue });
    closePopup();
  };

  const { target } = useOnClickOutside<HTMLDivElement>(closePopup);

  Listbox.defaultProps = {
    logTitle: '',
    version: 'default',
  };

  const [isModalOpen, openModal, closeModal] = useBooleanState(false);

  const onClickAddSemester = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openModal();
  };

  const deleteSemester = (e: React.MouseEvent<HTMLButtonElement>, semes: string) => {
    // 학기 삭제 api 연동 필요
    e.stopPropagation();
    console.log(semes);
    closePopup();
  };

  return (
    <div
      className={cn({
        [styles.select]: true,
        [styles['select--opened']]: isOpenedPopup,
      })}
      ref={target}
    >
      <button
        type="button"
        onClick={handleToggleListBox}
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--selected']]: isOpenedPopup,
        })}
      >
        {semesterValue !== null ? semesterOptionList.find((item) => item.value === semesterValue)?.label : ''}
        {isOpenedPopup ? <UpArrowIcon /> : <DownArrowIcon />}
      </button>
      {isOpenedPopup && (
        <ul className={styles.select__content} role="listbox">
          {semesterOptionList.map((optionValue) => (
            <button
              type="button"
              className={cn({
                [styles.select__option]: true,
                [styles['select__option--selected']]: optionValue.value === semesterValue,
              })}
              role="option"
              aria-selected={optionValue.value === semesterValue}
              data-value={optionValue.value}
              onClick={onClickOption}
              tabIndex={0}
            >
              <li
                className={styles['select__option--item']}
                key={optionValue.value}
              >
                {optionValue.label}
              </li>
              <div>
                <button
                  type="button"
                  className={styles['select__option--setting']}
                  onClick={(e) => deleteSemester(e, optionValue.value)}
                >
                  <TrashCanIcon />
                  <div>삭제</div>
                </button>
              </div>
            </button>
          ))}
          <button type="button" className={styles.add} onClick={onClickAddSemester}>
            <div>학기 추가하기</div>
            <AddIcon />
          </button>
        </ul>
      )}
      <div>
        {isModalOpen && (
        <SemesterSettingModal onClose={closeModal} />
        )}
      </div>
    </div>
  );
}

export default SemesterListbox;
