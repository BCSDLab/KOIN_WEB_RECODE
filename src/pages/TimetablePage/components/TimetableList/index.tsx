/* eslint-disable no-restricted-imports */
import React from 'react';
import TimetableSettingModal from 'pages/TimetablePage/components/TimetableList/TimetableSettingModal';
import { ReactComponent as AddIcon } from 'assets/svg/add-icon.svg';
import { ReactComponent as SettingIcon } from 'assets/svg/setting-icon.svg';
import { ReactComponent as BlueSettingIcon } from 'assets/svg/setting-icon-blue.svg';
import SemesterListbox from 'pages/TimetablePage/components/SemesterList';
import { useSemester } from 'utils/zustand/semester';
import useTimetableFrameList from 'pages/TimetablePage/hooks/useTimetableFrameList';
import { TimetableFrameInfo } from 'api/timetable/entity';
import useAddTimetableFrame from 'pages/TimetablePage/hooks/useAddTimetableFrame';
import { cn } from '@bcsdlab/utils';
import { Portal } from 'components/common/Modal/PortalProvider';
import InducingLoginModal from 'pages/TimetablePage/components/InducingLoginModal';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './TimetableList.module.scss';

interface TimetableListInfo {
  currentFrameIndex: number,
  setCurrentFrameIndex: (index: number) => void
}

export default function TimetableList({
  currentFrameIndex, setCurrentFrameIndex,
}: TimetableListInfo) {
  const [isModalOpen, openModal, closeModal] = useBooleanState(false);
  const portalManager = useModalPortal();
  const semester = useSemester();
  const token = useTokenState();
  const { data: timetableFrameList } = useTimetableFrameList(token, semester);
  const [focusFrame, setFocusFrame] = React.useState<TimetableFrameInfo | null>(null);
  const { mutate: addTimetableFrame } = useAddTimetableFrame(token);
  const handleTimetableSettingClick = (frame: TimetableFrameInfo) => {
    if (token) {
      setFocusFrame(frame);
      openModal();
    } else {
      portalManager.open((portalOption: Portal) => (
        <InducingLoginModal
          actionTitle="시간표 설정"
          detailExplanation="시간표 설정은 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)"
          onClose={portalOption.close}
        />
      ));
    }
  };
  const handleAddTimetableClick = () => {
    if (token) {
      addTimetableFrame({ semester: String(semester) });
    } else {
      portalManager.open((portalOption: Portal) => (
        <InducingLoginModal
          actionTitle="시간표 추가"
          detailExplanation="시간표 추가는 회원만 사용 가능합니다. 회원가입 또는 로그인 후 이용해주세요 :-)"
          onClose={portalOption.close}
        />
      ));
    }
  };

  React.useEffect(() => {
    if (timetableFrameList) {
      const mainFrame = timetableFrameList.find((frame) => frame.is_main === true);
      if (mainFrame && mainFrame.id) {
        setCurrentFrameIndex(mainFrame.id);
      }
    }
  }, [setCurrentFrameIndex, timetableFrameList]);

  return (
    <div className={styles['timetable-list']}>
      <SemesterListbox />
      <ul className={styles['timetable-list__list']} role="listbox">
        <div className={styles['timetable-list__list--scroll']} role="button" tabIndex={0}>
          {timetableFrameList?.map((frame) => (
            <button
              type="button"
              className={cn({
                [styles['timetable-list__item']]: true,
                [styles['timetable-list__item--selected']]: currentFrameIndex === frame.id || !frame.id,
              })}
              key={frame.id}
              onClick={() => (frame.id && setCurrentFrameIndex(frame.id))}
            >
              <li>
                {frame.timetable_name}
              </li>
              <button
                type="button"
                className={styles['timetable-list__item--setting']}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTimetableSettingClick(frame);
                }}
              >
                {(currentFrameIndex === frame.id || !frame.id)
                  ? <BlueSettingIcon />
                  : <SettingIcon />}
                설정
              </button>
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles['timetable-list__list--add']}
          onClick={handleAddTimetableClick}
        >
          시간표 추가하기
          <AddIcon />
        </button>
      </ul>
      {isModalOpen && (
        <TimetableSettingModal
          focusFrame={focusFrame!}
          setFocusFrame={setFocusFrame}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
