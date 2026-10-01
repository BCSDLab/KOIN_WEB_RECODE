import type { Semester, TimetableFrameInfo } from 'api/timetable/entity';
import useDeleteTimetableFrame from 'components/TimetablePage/hooks/useDeleteTimetableFrame';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';
import getObjectParticle from 'utils/ts/josa';

import styles from './TimetableModal.module.scss';

interface DeleteTimetableModalProps {
  semester: Semester;
  frame: TimetableFrameInfo;
  onClose: () => void;
}

export default function DeleteTimetableModal({ semester, frame, onClose }: DeleteTimetableModalProps) {
  const isLoggedIn = useIsLoggedIn();
  const { backgroundRef } = useOutsideClick({ onOutsideClick: onClose });
  const { mutate: deleteFrame } = useDeleteTimetableFrame(isLoggedIn, frame, {
    semester,
    plainMessage: '시간표가 삭제되었어요.',
  });

  const handleDelete = () => {
    if (frame.id) deleteFrame({ id: frame.id });
    onClose();
  };

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={`${styles.container} ${styles['container--delete']}`}>
        <p className={styles.message}>
          {frame.name}
          {getObjectParticle(frame.name)} <strong>삭제</strong>하시겠어요?
        </p>
        <div className={styles.buttons}>
          <button type="button" className={`${styles.button} ${styles['button--outline']}`} onClick={onClose}>
            취소
          </button>
          <button type="button" className={`${styles.button} ${styles['button--danger']}`} onClick={handleDelete}>
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}
