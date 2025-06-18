export type PasswordValidationState = {
  message: string;
  isValid: boolean;
};

export type PasswordValidationAction =
  | { type: 'EMPTY' }
  | { type: 'TOO_SHORT_OR_LONG' }
  | { type: 'MISSING_COMPLEXITY' }
  | { type: 'MISMATCH' }
  | { type: 'VALID' }
  | { type: 'CONFIRM_EMPTY' };

export const passwordValidationReducer = (
  _: PasswordValidationState,
  action: PasswordValidationAction,
): PasswordValidationState => {
  switch (action.type) {
    case 'EMPTY':
      return { message: '', isValid: false };
    case 'TOO_SHORT_OR_LONG':
      return { message: '비밀번호는 6자 이상 18자 이하여야 합니다.', isValid: false };
    case 'MISSING_COMPLEXITY':
      return { message: '비밀번호는 영문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.', isValid: false };
    case 'MISMATCH':
      return { message: '입력하신 비밀번호가 일치하지 않습니다.', isValid: false };
    case 'CONFIRM_EMPTY':
      return { message: '비밀번호 확인을 입력해주세요.', isValid: false };
    case 'VALID':
      return { message: '', isValid: true };
    default:
      return { message: '', isValid: false };
  }
};
