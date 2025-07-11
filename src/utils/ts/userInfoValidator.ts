import { UserResponse, GeneralUserResponse } from 'api/auth/entity';

export type RequiredStudentFields = {
  login_id: string;
  gender: 0 | 1;
  major: string;
  name: string;
  phone_number: string;
  student_number: string;
  user_type: 'STUDENT';
};

export type RequiredGeneralUserFields = {
  login_id: string;
  gender: 0 | 1;
  name: string;
  phone_number: string;
  user_type: 'GENERAL';
};

export const validateStudentInfo = (user: UserResponse): boolean => {
  const requiredFields: (keyof RequiredStudentFields)[] = [
    'login_id',
    'gender',
    'major',
    'name',
    'phone_number',
    'student_number',
    'user_type',
  ];

  return requiredFields.every((field) => {
    const value = user[field];
    return value !== null && value !== undefined && value !== '';
  });
};

export const validateGeneralUserInfo = (user: GeneralUserResponse): boolean => {
  const requiredFields: (keyof RequiredGeneralUserFields)[] = [
    'login_id',
    'gender',
    'name',
    'phone_number',
    'user_type',
  ];

  return requiredFields.every((field) => {
    const value = user[field];
    return value !== null && value !== undefined && value !== '';
  });
};

export const validateUserInfo = (user: UserResponse | GeneralUserResponse): boolean => {
  if (user.user_type === 'STUDENT') {
    return validateStudentInfo(user as UserResponse);
  }
  if (user.user_type === 'GENERAL') {
    return validateGeneralUserInfo(user as GeneralUserResponse);
  }
  return false;
};
