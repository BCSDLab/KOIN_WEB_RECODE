import { toast, type TypeOptions } from 'react-toastify';

const TOAST_TYPE = {
  default: 'default',
  success: 'success',
  info: 'info',
  error: 'error',
  warning: 'warning',
} as const;

type ToastType = keyof typeof TOAST_TYPE;

const showToast = (type: ToastType, message: string) => toast(message, { type: TOAST_TYPE[type] as TypeOptions });

export default showToast;
