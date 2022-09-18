import { toast } from 'react-toastify';

const TOAST_TYPE = {
  default: 'DEFAULT',
  success: 'SUCCESS',
  info: 'INFO',
  error: 'ERROR',
  warning: 'WARNING',
} as const;

type ToastType = keyof typeof TOAST_TYPE;

const showToast = (type: ToastType, message: string) => toast(message, {
  type: toast.TYPE[TOAST_TYPE[type]],
});

export default showToast;
