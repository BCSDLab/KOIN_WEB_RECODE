import showToast from 'utils/ts/showToast';

import styles from './MobileToast.module.scss';

// 고정 id로 모바일 토스트가 동시에 1개만 뜨도록 한다. 떠 있는 동안 들어온 호출은 무시된다.
const MOBILE_TOAST_ID = 'mobile-toast';

export default function showMobileToast(type: Parameters<typeof showToast>[0], message: string) {
  return showToast(type, message, {
    toastId: MOBILE_TOAST_ID,
    className: styles.toast,
    position: 'bottom-center',
    hideProgressBar: true,
    closeButton: false,
    icon: false,
  });
}
