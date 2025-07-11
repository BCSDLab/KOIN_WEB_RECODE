import { UserResponse, GeneralUserResponse } from 'api/auth/entity';
import {
  validateUserInfo,
  validateStudentInfo,
  validateGeneralUserInfo,
} from 'utils/ts/userInfoValidator';

interface UseUserInfoValidationReturn {
  isValid: boolean;
  validateStudent: (user: UserResponse) => boolean;
  validateGeneral: (user: GeneralUserResponse) => boolean;
}

export default function useUserInfoValidation(
  user: UserResponse | GeneralUserResponse | null,
): UseUserInfoValidationReturn {
  const isValid = user ? validateUserInfo(user) : false;

  const validateStudent = (studentUser: UserResponse): boolean => validateStudentInfo(studentUser);

  const validateGeneral = (generalUser: GeneralUserResponse): boolean => (
    validateGeneralUserInfo(generalUser)
  );

  return {
    isValid,
    validateStudent,
    validateGeneral,
  };
}
