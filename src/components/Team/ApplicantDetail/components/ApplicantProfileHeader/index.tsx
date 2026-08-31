import { cn } from '@bcsdlab/utils';
import ProfileAvatarIcon from 'assets/svg/Team/profile-avatar-icon.svg';
import formatApplicationStatus from 'components/Team/utils/formatApplicationStatus';
import type { TeamApplicationRole, TeamApplicationStatus } from 'api/team/entity';
import styles from './ApplicantProfileHeader.module.scss';

const STATUS_CLASS: Record<TeamApplicationStatus, string> = {
  PENDING: 'header__status--pending',
  ACCEPTED: 'header__status--accepted',
  REJECTED: 'header__status--rejected',
};

const formatStudentYear = (studentYear: number) => `${String(studentYear).slice(-2)}학번`;

interface ApplicantProfileHeaderProps {
  nickname: string;
  status: TeamApplicationStatus;
  role: TeamApplicationRole | null;
  department: string;
  studentYear: number;
}

export default function ApplicantProfileHeader({
  nickname,
  status,
  role,
  department,
  studentYear,
}: ApplicantProfileHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.header__avatar}>
        <ProfileAvatarIcon />
      </div>

      <div className={styles.header__body}>
        <div className={styles.header__nameRow}>
          <span className={styles.header__name}>{nickname}</span>
          <span className={cn({ [styles.header__status]: true, [styles[STATUS_CLASS[status]]]: true })}>
            {formatApplicationStatus(status)}
          </span>
        </div>

        <p className={styles.header__meta}>
          {role && (
            <>
              <span className={styles.header__role}>{role.name}</span> |{' '}
            </>
          )}
          {department} · {formatStudentYear(studentYear)}
        </p>
      </div>
    </div>
  );
}
