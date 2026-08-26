import styles from './RecruitmentCard.module.scss';

interface RecruitmentCardProps {
  category: string;
  status: string;
  title: string;
  roles: string[];
  location: string;
  period: string;
  currentMemberCount: number;
  maxMemberCount: number;
}

export default function RecruitmentCard({
  category,
  status,
  title,
  roles,
  location,
  period,
  currentMemberCount,
  maxMemberCount,
}: RecruitmentCardProps) {
  return (
    <article className={styles.card}>
      <div>
        <span>{category}</span>
        <span>{status}</span>
      </div>

      <h2>{title}</h2>

      {roles.length > 0 && (
        <div>
          {roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
      )}

      <div>
        <span>{location}</span>
        <span>{period}</span>
        <span>
          {currentMemberCount}/{maxMemberCount}명
        </span>
      </div>
    </article>
  );
}
