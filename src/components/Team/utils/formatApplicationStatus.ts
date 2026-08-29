import type { TeamApplicationStatus } from 'api/team/entity';

const APPLICATION_STATUS_LABEL: Record<TeamApplicationStatus, string> = {
  PENDING: '대기',
  ACCEPTED: '승인',
  REJECTED: '거절',
};

export default function formatApplicationStatus(status: TeamApplicationStatus) {
  return APPLICATION_STATUS_LABEL[status];
}
