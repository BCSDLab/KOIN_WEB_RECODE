import { cn } from '@bcsdlab/utils';
import styles from './FoundChip.module.scss';

type ChipSize = 'xs' | 'small' | 'large';

interface FoundChipProps {
  isFound: boolean;
  size?: ChipSize;
}

export default function FoundChip({ isFound, size = 'large' }: FoundChipProps) {
  return (
    <div
      className={cn({
        [styles.chip]: true,
        [styles[`chip--${size}`]]: true,
        [styles['chip--found']]: isFound,
      })}
    >
      {isFound ? '찾음' : '찾는중'}
    </div>
  );
}
