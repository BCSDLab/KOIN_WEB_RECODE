import { ReactComponent as CloseIcon } from 'assets/svg/close-icon-black.svg';
import type { TimetableFrameInfo } from 'api/timetable/entity';
import useUpdateTimetableFrame from 'pages/TimetablePage/hooks/useUpdateTimetableFrame';
import useDeleteTimetableFrame from 'pages/TimetablePage/hooks/useDeleteTimetableFrame';
import { useSemester } from 'utils/zustand/semester';
import useToast from 'components/common/Toast/useToast';
import showToast from 'utils/ts/showToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import styles from './TimetableSettingModal.module.scss';

export interface TimetableSettingModalProps {
  focusFrame: TimetableFrameInfo
  onClose: () => void
}

export default function TimetableSettingModal({
  focusFrame,
  onClose,
}: TimetableSettingModalProps) {
  const token = useTokenState();
  const semester = useSemester();
  const toast = useToast();

  const { mutate: updateFrameInfo } = useUpdateTimetableFrame();
  const { mutate: deleteTimetableFrame } = useDeleteTimetableFrame(
    token,
    semester,
  );

  const recoverFrame = () => {
  // TODO: v2/timetables/lecture api 연결 후 시간표 프레임 추가와 강의 정보 추가로 recover 구현 예정.
  };

  const submitFrameForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.currentTarget;

    if (!focusFrame.id) {
      return showToast('warning', '로그인 후 이용 가능합니다.');
    }

    if (target?.checker) {
      updateFrameInfo({
        ...focusFrame,
        timetable_name: target.frame.value,
        is_main: target.checker.checked,
      });
    }

    if (focusFrame.is_main) {
      updateFrameInfo({
        ...focusFrame,
        timetable_name: target.frame.value,
        is_main: true,
      });
    }

    return onClose();
  };

  const onDelete = (frame: TimetableFrameInfo) => {
    if (!focusFrame.id) {
      showToast('warning', '로그인 후 이용 가능합니다.');
      return;
    }

    toast.open({
      message: `선택하신 [${frame.timetable_name}]이 삭제되었습니다.`,
      recoverMessage: `[${frame.timetable_name}]이 복구되었습니다.`,
      onRecover: recoverFrame,
    });
    deleteTimetableFrame(focusFrame.id);
    onClose();
  };

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <header className={styles.container__header}>
          <span className={styles.container__title}>시간표 설정</span>
          <button
            aria-label="close-modal"
            type="button"
            onClick={onClose}
            className={styles['container__close-button']}
          >
            <CloseIcon />
          </button>
        </header>

        <form onSubmit={submitFrameForm}>
          <div className={styles.container__input}>
            <input
              name="frame"
              placeholder={focusFrame.timetable_name}
              className={styles['container__timetable-name']}
              defaultValue={focusFrame.timetable_name}
            />
          </div>
          {!focusFrame.is_main ? (
            <label className={styles['container__check-container']}>
              <input
                type="checkbox"
                name="checker"
                className={styles.container__checkbox}
              />
              <span className={styles['container__checkbox-title']}>
                기본 시간표로 설정하기
              </span>
            </label>
          ) : <div className={styles['container__none-checkbox']} />}
          <div className={styles.container__button}>
            <button
              type="button"
              className={styles['container__button--delete']}
              onClick={() => onDelete(focusFrame)}
            >
              삭제하기
            </button>
            <button type="submit" className={styles['container__button--save']}>
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
