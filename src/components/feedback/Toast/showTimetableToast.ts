import showToast from 'utils/ts/showToast';

import styles from './TimetableMobileToast.module.scss';

export default function showTimetableToast(type: Parameters<typeof showToast>[0], message: string) {
  return showToast(type, message, {
    className: styles.toast,
    position: 'bottom-center',
    hideProgressBar: true,
    closeButton: false,
    icon: false,
  });
}
