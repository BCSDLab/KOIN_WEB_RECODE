import { useRouter } from 'next/router';
import ArrowBackIcon from 'assets/svg/arrow-back.svg';
import styles from './SubPageHeader.module.scss';

interface SubPageHeaderProps {
  title: string;
}

export default function SubPageHeader({ title }: SubPageHeaderProps) {
  const router = useRouter();

  return (
    <div className={styles.header}>
      <button
        type="button"
        className={styles['header__back-button']}
        onClick={() => router.back()}
        aria-label="뒤로가기"
      >
        <ArrowBackIcon />
      </button>
      <h1 className={styles.header__title}>{title}</h1>
      <div className={styles['header__spacer']} />
    </div>
  );
}
