import showToast from 'utils/ts/showToast';

import styles from './TimetableMobileToast.module.scss';

// 고정 id로 모바일 시간표 토스트가 동시에 1개만 뜨도록 한다. 떠 있는 동안 들어온 호출은 무시된다.
const TIMETABLE_MOBILE_TOAST_ID = 'timetable-mobile-toast';

export default function showTimetableToast(type: Parameters<typeof showToast>[0], message: string) {
  return showToast(type, message, {
    toastId: TIMETABLE_MOBILE_TOAST_ID,
    className: styles.toast,
    position: 'bottom-center',
    hideProgressBar: true,
    closeButton: false,
    icon: false,
  });
}
