import type { TeamRecruitmentStatus } from 'api/team/entity';

export default function formatRecruitmentStatus(status: TeamRecruitmentStatus, dDay: number | null) {
  if (status !== 'RECRUITING') {
    return '모집완료';
  }

  if (dDay === null) {
    return '모집 중';
  }

  if (dDay <= 0) {
    return 'D-Day';
  }

  return `D-${dDay}`;
}
