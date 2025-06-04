import { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { UnionUserResponse } from 'utils/hooks/state/useUser';

export function isStudentUser(user: UnionUserResponse | null): user is UserResponse {
  return (user as UserResponse).user_type === 'STUDENT';
}

export function isGeneralUser(user: UnionUserResponse | null): user is UserResponse {
  return (user as GeneralUserResponse).user_type === 'GENERAL';
}
