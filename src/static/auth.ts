export const REGEX = {
  PASSWORD:
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/])[A-Za-z\d!@#$%^&*()_\-+=~`[\]{}|\\:;"'<>,.?/]{6,18}$/,
  NICKNAME: /^[가-힣a-zA-Z0-9]{0,10}$/,
  ADMIN_NICKNAME: /admin|관리자/,
  USERID: /^[a-z0-9_.-]{5,13}$/,
  STUDENT_NUMBER: /^(19|20)\d{2}\d{4,6}$/,
  EMAIL: /^(?=.{1,30}$)[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/,
  STUDENTEMAIL: /^[a-zA-Z0-9._%+-]{3,30}$/,
  PHONE_NUMBER: /^(\d{3}-\d{3,4}-\d{4}|\d{10,11})$/,
  NAME_KR: /^[가-힣]{2,5}$/,
  NAME_EN: /^[a-zA-Z\s]{2,30}$/,
};

export const MESSAGES = {
  PASSWORD: {
    FORMAT: '올바른 비밀번호 양식이 아닙니다. 다시 입력해 주세요.',
    MISMATCH: '비밀번호가 일치하지 않습니다.',
    MATCH: '비밀번호가 일치합니다.',
  },
  NAME: {
    REQUIRED: '이름은 필수 항목입니다.',
    FORMAT_KR: '한글 이름은 2~5자여야 합니다.',
    FORMAT_EN: '영문 이름은 2~30자여야 합니다.',
    INVALID: '한글 또는 영문만 입력 가능합니다.',
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
    REGISTRATION: '휴대전화 등록을 안 하셨나요?',
    NOT_REGISTERED: '유효하지 않은 전화번호 입니다.',
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
    REQUIRED: '5~13자의 영소문자, 숫자와 특수문자( -, _ , .)만 사용 가능합니다.',
  },
  STUDENT_NUMBER: {
    FORMAT: '올바른 학번 양식이 아닙니다. 다시 입력해 주세요.',
  },
  EMAIL: {
    AVAILABLE: '사용 가능한 이메일입니다.',
    FORMAT: '올바른 이메일 형식이 아닙니다. 다시 입력해 주세요.',
    DUPLICATED: '이미 사용 중인 이메일입니다.',
    NOT_REGISTERED: '유효하지 않은 이메일입니다.',
    CODE_SENT: '인증번호가 발송되었습니다.',
  },
  FIND_PASSWORD: {
    NOT_REGISTERED: '휴대전화 등록을 안 하셨나요?',
  },
  ID: {
    FORMAT: '올바른 아이디 양식이 아닙니다. 다시 입력해 주세요.',
    NOT_REGISTERED: '유효하지 않은 아이디입니다.',
  },
};

export type UserType = '학생' | '외부인';

export type ContactType = 'PHONE' | 'EMAIL';

export const GENDER_OPTIONS = [
  { label: '여자', value: '1' },
  { label: '남자', value: '0' },
];

export const INQUIRY_URL = 'https://open.kakao.com/o/sgiYx4Qg';

export const STORAGE_KEY = {
  USER_INFO_COMPLETION: 'isUserInfoComplete',
  MODAL_SESSION_SHOWN: 'userInfoModalShown',
} as const;

export const COMPLETION_STATUS = {
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
} as const;
