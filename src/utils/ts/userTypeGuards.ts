import { UserResponse } from 'api/auth/entity';
import { UnionUserResponse } from 'utils/hooks/state/useUser';

export function isStudentUser(user: UnionUserResponse | null): user is UserResponse {
  return (user as UserResponse).student_number !== undefined;
}

export function isGeneralUser(user: UnionUserResponse | null): user is UserResponse {
  return (user as UserResponse).student_number === undefined;
}
