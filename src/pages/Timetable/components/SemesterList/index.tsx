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
import useTokenState from 'utils/hooks/useTokenState';
import useDeleteSemester from 'pages/Timetable/hooks/useDeleteSemester';
import AddSemesterModal from './AddSemesterModal';
import styles from './SemesterList.module.scss';
import DeleteSemesterModal from './DeleteSemesterModal';

function SemesterListbox() {
  const [isOpenedPopup, , closePopup, triggerPopup] = useBooleanState(false);
  const logger = useLogger();
  const handleToggleListBox = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };
  const semester = useSemester();
  const { updateSemester } = useSemesterAction();
  const [currentSemester, setCurrentSemester] = useState(semester);
  const token = useTokenState();
  const onChangeSelect = (e: { target: { value: string } }) => {
    const { target } = e;
    updateSemester(target?.value);
    setCurrentSemester(target?.value);
  };
  const semesterOptionList = useSemesterOptionList();
  const recentSemester = semesterOptionList[0].value;
  React.useEffect(() => {
    updateSemester(currentSemester);
  // onChange와 deptOptionList가 렌더링될 때마다 선언되서 처음 한번만 해야 하는 onChange를 렌더링할 때마다 한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    const optionValue = currentTarget.getAttribute('data-value');
    onChangeSelect({ target: { value: optionValue ?? '' } });
    logger.actionEventClick({ actionTitle: 'USER', title: 'select_semester', value: currentSemester });
    closePopup();
  };

  const { target } = useOnClickOutside<HTMLDivElement>(closePopup);

  Listbox.defaultProps = {
    logTitle: '',
    version: 'default',
  };
  const [selectedSemester, setSelectedSemester] = React.useState('');
  const [
    isAddSemesterModalOpen, openAddSemesterModal, closeAddSemesterModal,
  ] = useBooleanState(false);
  const [
    isDeleteSemesterModalOpen, openDeleteSemesterModal, closeDeleteSemesterModal,
  ] = useBooleanState(false);

  const onClickAddSemester = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openAddSemesterModal();
  };

  const onClickDeleteSemester = (e: React.MouseEvent<HTMLButtonElement>, semes: string) => {
    e.stopPropagation();
    setSelectedSemester(semes);
    openDeleteSemesterModal();
  };
  const { mutate: deleteTimetableFrame } = useDeleteSemester(token, selectedSemester);
  const handleDeleteSemester = () => {
    deleteTimetableFrame();
    if (selectedSemester === currentSemester) {
      setCurrentSemester(recentSemester);
      updateSemester(recentSemester);
    }
    closeDeleteSemesterModal();
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
        {currentSemester !== null ? semesterOptionList.find((item) => item.value === currentSemester)?.label : ''}
        {isOpenedPopup ? <UpArrowIcon /> : <DownArrowIcon />}
      </button>
      {isOpenedPopup && (
        <div className={styles.select__content}>
          <ul className={styles['select__content--list']} role="listbox">
            {semesterOptionList.map((optionValue) => (
              <button
                type="button"
                className={cn({
                  [styles.select__option]: true,
                  [styles['select__option--selected']]: optionValue.value === currentSemester,
                })}
                role="option"
                aria-selected={optionValue.value === currentSemester}
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
                    onClick={(e) => onClickDeleteSemester(e, optionValue.value)}
                  >
                    <TrashCanIcon />
                    <div>삭제</div>
                  </button>
                </div>
              </button>
            ))}
          </ul>
          <button type="button" className={styles.add} onClick={onClickAddSemester}>
            <div>학기 추가하기</div>
            <AddIcon />
          </button>
        </div>
      )}
      <div>
        {isAddSemesterModalOpen && (
        <AddSemesterModal onClose={closeAddSemesterModal} />
        )}
      </div>
      <div>
        {isDeleteSemesterModalOpen && (
        <DeleteSemesterModal
          onClose={closeDeleteSemesterModal}
          handleDeleteSemester={handleDeleteSemester}
        />
        )}
      </div>
    </div>
  );
}

export default SemesterListbox;
