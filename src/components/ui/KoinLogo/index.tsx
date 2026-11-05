import { cn } from '@bcsdlab/utils';
import BbicoIcon from 'assets/svg/common/bbico-icon.svg';
import BbicoMutedIcon from 'assets/svg/common/bbico-muted-icon.svg';

import styles from './KoinLogo.module.scss';

interface KoinLogoProps {
  muted?: boolean;
}

export default function KoinLogo({ muted = false }: KoinLogoProps) {
  return (
    <span
      className={cn({
        [styles.logo]: true,
        [styles['logo--muted']]: muted,
      })}
      role="img"
      aria-label="KOIN"
    >
      {muted ? <BbicoMutedIcon aria-hidden /> : <BbicoIcon aria-hidden />}
      <span className={styles.logo__title} aria-hidden>
        KOIN
      </span>
    </span>
  );
}
