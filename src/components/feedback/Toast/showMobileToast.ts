import showToast from 'utils/ts/showToast';

import styles from './MobileToast.module.scss';

export default function showMobileToast(type: Parameters<typeof showToast>[0], message: string) {
  return showToast(type, message, {
    toastId: `mobile-toast-${type}-${message}`,
    className: styles.toast,
    position: 'bottom-center',
    hideProgressBar: true,
    closeButton: false,
    icon: false,
  });
}
