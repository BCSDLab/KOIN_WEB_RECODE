import { MESSAGES, REGEX } from 'static/auth';

export const validateName = (value: string) => {
  if (/^[가-힣]+$/.test(value)) {
    return REGEX.NAME_KR.test(value) ? true : MESSAGES.NAME.FORMAT_KR;
  }

  if (/^[a-zA-Z\s]+$/.test(value)) {
    return REGEX.NAME_EN.test(value) ? true : MESSAGES.NAME.FORMAT_EN;
  }

  return MESSAGES.NAME.INVALID;
};
