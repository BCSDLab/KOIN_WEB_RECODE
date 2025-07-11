import { UserResponse, GeneralUserResponse } from 'api/auth/entity';

export const validateStudentInfo = (user: UserResponse): boolean => {
  const requiredFields = [
    'login_id',
    'gender',
    'major',
    'name',
    'phone_number',
    'student_number',
  ] as const;

  return requiredFields.every((field) => {
    const value = user[field];
    return value !== null && value !== undefined && value !== '';
  });
};

export const validateGeneralUserInfo = (user: GeneralUserResponse): boolean => {
  const requiredFields = [
    'login_id',
    'gender',
    'name',
    'phone_number',
  ] as const;

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
