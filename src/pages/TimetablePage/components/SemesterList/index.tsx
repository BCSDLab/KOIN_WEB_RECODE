import React from 'react';
import { cn } from '@bcsdlab/utils';
import { useSemester, useSemesterAction } from 'utils/zustand/semester';
import DownArrowIcon from 'assets/svg/down-arrow-icon.svg';
import AddIcon from 'assets/svg/add-icon.svg';
import TrashCanIcon from 'assets/svg/trash-can-icon.svg';
import useSemesterOptionList from 'pages/TimetablePage/hooks/useSemesterOptionList';
import useDeleteSemester from 'pages/TimetablePage/hooks/useDeleteSemester';
import { Portal } from 'components/modal/Modal/PortalProvider';
import InducingLoginModal from 'pages/TimetablePage/components/InducingLoginModal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useLogger from 'utils/hooks/analytics/useLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useTokenState from 'utils/hooks/state/useTokenState';
import useAddSemester from 'pages/TimetablePage/hooks/useAddSemester';
import useSemesterCheck from 'pages/TimetablePage/hooks/useMySemester';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import { Semester } from 'api/timetable/entity';
import { useLocation } from 'react-router-dom';
import DeleteSemesterModal from './DeleteSemesterModal';
import styles from './SemesterList.module.scss';
import AddSemesterModal from './AddSemesterModal';

function SemesterList({ isViewMode }: { isViewMode?: boolean }) {
  const logger = useLogger();
  const semester = useSemester();
  const token = useTokenState();
  const portalManager = useModalPortal();
  const semesterOptionList = useSemesterOptionList();
  const { updateSemester } = useSemesterAction();
  const { pathname } = useLocation();
  const isGraduationCalculatorMode = pathname.includes('/graduation');

  const [isOpenSemesterList, , closePopup, triggerPopup] = useBooleanState(false);
  const [selectedSemester, setSelectedSemester] = React.useState(semester);
  const [isModalOpen, setModalOpenTrue, setModalOpenFalse] = useBooleanState(false);

  const { mutate: deleteTimetableFrame } = useDeleteSemester(
    token,
    selectedSemester,
  );

  const semesterListToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    triggerPopup();
  };

  const onClickOption = (clickededSemester: Semester) => {
    updateSemester(clickededSemester);
    if (isGraduationCalculatorMode) {
      logger.actionEventClick({
        actionTitle: 'USER',
        event_label: 'graduation_calculator_semester',
        value: `학기 드롭다운_${clickededSemester.year}${clickededSemester.term}`,
        event_category: 'click',
      });
    } else {
      logger.actionEventClick({
        actionTitle: 'USER',
        event_label: 'timetable',
        value: `click_semester_${clickededSemester.year}${clickededSemester.term}`,
        event_category: 'click',
      });
    }
    closePopup();
  };

  const { mutate: addSemester } = useAddSemester(token);
  const { data: mySemester } = useSemesterCheck(token);
  const { containerRef } = useOutsideClick({ onOutsideClick: closePopup });

  const onClickAddSemester = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (token) {
      setModalOpenTrue();
      portalManager.open((portalOption: Portal) => (
        <AddSemesterModal
          onClose={portalOption.close}
          setModalOpenFalse={setModalOpenFalse}
          addSemester={addSemester}
          mySemester={mySemester}
        />
      ));
    } else {
      portalManager.open((portalOption: Portal) => (
        <InducingLoginModal
          actionTitle="학기 추가"
          detailExplanation="학기 추가는 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)"
          onClose={portalOption.close}
        />
      ));
    }
  };

  const handleDeleteSemester = () => {
    deleteTimetableFrame();
    closePopup();
    if (selectedSemester === semester) {
      updateSemester(semesterOptionList[0].value);
    }
  };

  const onClickDeleteSemester = (e: React.MouseEvent<HTMLButtonElement>, semes: Semester) => {
    e.stopPropagation();
    if (token) {
      setSelectedSemester(semes);
      setModalOpenTrue();
      portalManager.open((portalOption: Portal) => (
        <DeleteSemesterModal
          onClose={portalOption.close}
          handleDeleteSemester={handleDeleteSemester}
          setModalOpenFalse={setModalOpenFalse}
        />
      ));
    } else {
      portalManager.open((portalOption: Portal) => (
        <InducingLoginModal
          actionTitle="학기 삭제"
          detailExplanation="학기 삭제는 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)"
          onClose={portalOption.close}
        />
      ));
    }
  };

  React.useEffect(() => {
    if (semesterOptionList.length > 0) {
      if (!semesterOptionList.find((sem) => sem.value === semester)) {
        updateSemester(semesterOptionList[0].value);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semesterOptionList]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => () => portalManager.close(), []);

  return (
    <div
      className={cn({
        [styles.select]: true,
        [styles['select--graduation']]: isGraduationCalculatorMode,
        [styles['select--opened']]: isOpenSemesterList,
      })}
      ref={isModalOpen ? null : containerRef}
    >
      <button
        type="button"
        onClick={
          semesterOptionList.length > 0 && semester !== null
            ? semesterListToggle
            : onClickAddSemester
        }
        className={cn({
          [styles.select__trigger]: true,
          [styles['select__trigger--selected']]: isOpenSemesterList,
          [styles['select__trigger--no-option']]: semesterOptionList.length === 0,
          [styles['select__trigger--graduation']]: isGraduationCalculatorMode,
        })}
      >
        {semesterOptionList.length > 0 && semester !== null
          ? semesterOptionList.find((item) => item.value === semester)
            ?.label || semesterOptionList[0].label
          : '학기 추가하기'}

        {semesterOptionList.length > 0 && semester !== null ? (
          <DownArrowIcon />
        ) : (
          <AddIcon />
        )}
      </button>

      {isOpenSemesterList && (
        <div className={styles.select__content}>
          <ul
            className={cn({
              [styles['select__content--list']]: true,
              [styles['select__content--graduation']]: isGraduationCalculatorMode,
            })}
            role="listbox"
          >
            {semesterOptionList.map((optionValue) => (
              <button
                type="button"
                className={cn({
                  [styles.select__option]: true,
                  [styles['select__option--selected']]:
                    optionValue.value === semester,
                })}
                role="option"
                aria-selected={optionValue.value === semester}
                data-value={optionValue.value}
                onClick={() => onClickOption(optionValue.value)}
                tabIndex={0}
              >
                <li
                  className={styles['select__option--item']}
                  key={optionValue.label}
                >
                  {optionValue.label}
                </li>
                <div>
                  {!isViewMode && (
                    <button
                      type="button"
                      className={styles['select__option--delete-button']}
                      onClick={(e) => onClickDeleteSemester(e, optionValue.value)}
                    >
                      <TrashCanIcon />
                      <div>삭제</div>
                    </button>
                  )}
                </div>
              </button>
            ))}
          </ul>
          {!isViewMode && (
            <button
              type="button"
              className={styles['add-button']}
              onClick={onClickAddSemester}
            >
              <div>학기 추가하기</div>
              <AddIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SemesterList;
