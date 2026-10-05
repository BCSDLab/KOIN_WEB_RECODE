import { GeneralUserResponse, UserResponse } from 'api/auth/entity';
import { UnionUserResponse } from 'utils/hooks/state/useUser';

// utils/ts/userTypeGuards.ts
export function isStudentUser(
  user: UnionUserResponse | null | undefined,
): user is UserResponse & { user_type: 'STUDENT' } {
  return !!user && 'user_type' in user && user.user_type === 'STUDENT';
}

export function isGeneralUser(
  user: GeneralUserResponse | null | undefined,
): user is UserResponse & { user_type: 'GENERAL' } {
  return !!user && 'user_type' in user && user.user_type === 'GENERAL';
}
