import { isKoinError, sendClientError } from '@bcsdlab/koin';
import CloseIcon from 'assets/svg/close-icon-black.svg';
import useDeleteTimetableFrame from 'components/TimetablePage/hooks/useDeleteTimetableFrame';
import useUpdateTimetableFrame from 'components/TimetablePage/hooks/useUpdateTimetableFrame';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import showToast from 'utils/ts/showToast';
import type { TimetableFrameInfo } from 'api/timetable/entity';
import styles from './TimetableSettingModal.module.scss';

export interface TimetableSettingModalProps {
  focusFrame: TimetableFrameInfo;
  onClose: () => void;
}

export default function TimetableSettingModal({ focusFrame, onClose }: TimetableSettingModalProps) {
  const token = useTokenState();
  const { mutate: updateFrameInfo } = useUpdateTimetableFrame();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });

  const submitFrameForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.currentTarget;

    if (!focusFrame.id) {
      return showToast('warning', '로그인 후 이용 가능합니다.');
    }

    if (focusFrame.is_main) {
      updateFrameInfo({
        ...focusFrame,
        name: target.frame.value,
        is_main: true,
      });
    } else if (target?.checker) {
      updateFrameInfo({
        ...focusFrame,
        name: target.frame.value,
        is_main: target.checker.checked,
      });
    }

    return onClose();
  };

  const { mutate: deleteTimetableFrame } = useDeleteTimetableFrame(token, focusFrame);
  const onDelete = async () => {
    if (!focusFrame.id) {
      showToast('warning', '로그인 후 이용 가능합니다.');
      return;
    }
    try {
      await deleteTimetableFrame({ id: focusFrame.id });
      onClose();
    } catch (err) {
      if (isKoinError(err)) {
        showToast('error', err.message);
        return;
      }
      sendClientError(err);
    }
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
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
              placeholder={focusFrame.name}
              className={styles['container__timetable-name']}
              defaultValue={focusFrame.name}
            />
          </div>

          <label className={styles['container__check-container']}>
            <input
              type="checkbox"
              name="checker"
              className={styles.container__checkbox}
              disabled={focusFrame.is_main}
              checked={focusFrame.is_main ? true : undefined}
            />
            <span className={styles['container__checkbox-title']}>기본 시간표로 설정하기</span>
          </label>

          <div className={styles.container__button}>
            <button
              id="default_timetable"
              type="button"
              className={styles['container__button--delete']}
              onClick={() => onDelete()}
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
