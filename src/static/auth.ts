export const REGEX = {
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]{6,18}$/,
  NICKNAME: /^[가-힣a-zA-Z0-9]{0,10}$/,
  USERID: /^[a-z0-9_.-]{5,13}$/,
  STUDENT_NUMBER: /^\d{8,10}$/,
  EMAIL: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
};

export const MESSAGES = {
  PASSWORD: {
    FORMAT: '올바른 비밀번호 양식이 아닙니다. 다시 입력해 주세요.',
    MISMATCH: '비밀번호가 일치하지 않습니다.',
    MATCH: '비밀번호가 일치합니다.',
  },
  NICKNAME: {
    DUPLICATED: '중복된 닉네임입니다. 다시 입력해 주세요.',
    AVAILABLE: '사용 가능한 닉네임입니다.',
    FORMAT: '한글, 영문 및 숫자 포함하여 10자 내로 입력해 주세요.',
  },
  PHONE: {
    INVALID: '올바른 전화번호 양식이 아닙니다. 다시 입력해 주세요.',
    ALREADY_REGISTERED: '이미 가입된 전화 번호입니다.',
    CODE_SENT: '인증번호가 발송되었습니다.',
  },
  VERIFICATION: {
    DEFAULT: '인증번호 발송이 안 되시나요?',
    TIMEOUT: '유효시간이 지났습니다. 인증번호를 재발송 해주세요.',
    INCORRECT: '인증번호가 일치하지 않습니다. 다시 입력해 주세요.',
    CORRECT: '인증번호가 일치합니다.',
    STOP: '1일 발송 한도를 초과했습니다. 24시간 이후 재시도 바랍니다.',
  },
  USERID: {
    AVAILABLE: '사용 가능한 아이디입니다.',
    DUPLICATED: '이미 사용 중인 아이디입니다.',
    INVALID: '올바른 아이디 양식이 아닙니다. 다시 입력해 주세요.',
    REQUIRED: '영소문자, 숫자, _, -, . 로만 조합된 문자열만 입력 가능합니다.',
  },
  STUDENT_NUMBER: {
    FORMAT: '올바른 학번 양식이 아닙니다. 다시 입력해 주세요.',
  },
  EMAIL: {
    FORMAT: '올바른 이메일 형식이 아닙니다. 다시 입력해 주세요.',
  },
};

export type UserType = '학생' | '외부인';

export const GENDER_OPTIONS = [
  { label: '남성', value: '0' },
  { label: '여성', value: '1' },
];
