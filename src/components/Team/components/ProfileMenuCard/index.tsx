import type { ComponentType, SVGProps } from 'react';
import ChevronRightIcon from 'assets/svg/Team/chevron-right-icon.svg';
import styles from './ProfileMenuCard.module.scss';

interface ProfileMenuCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

export default function ProfileMenuCard({ icon: Icon, title, description }: ProfileMenuCardProps) {
  return (
    <button type="button" className={styles.card}>
      <span className={styles.card__icon}>
        <Icon aria-hidden />
      </span>
      <span className={styles.card__body}>
        <span className={styles.card__title}>{title}</span>
        <span className={styles.card__description}>{description}</span>
      </span>
      <ChevronRightIcon aria-hidden className={styles.card__chevron} />
    </button>
  );
}
