import type { UserInfo } from 'api/auth/entity';

// 유형 문자열 대신 학번 유무로 판단해 총학생회도 학생으로 다룬다.
export function isStudentUser(user: UserInfo | null | undefined): user is UserInfo & { student_number: string } {
  return !!user && user.student_number !== null;
}
