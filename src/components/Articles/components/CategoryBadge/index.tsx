import { cn } from '@bcsdlab/utils';
import { CATEGORY_BADGE_MODIFIER } from 'static/lostItem';

import styles from './CategoryBadge.module.scss';

interface CategoryBadgeProps {
  category: string;
  isMobile: boolean;
  className?: string;
}

export default function CategoryBadge({ category, isMobile, className }: CategoryBadgeProps) {
  const modifier = CATEGORY_BADGE_MODIFIER[category];
  const showColor = isMobile && !!modifier;

  return (
    <span
      className={cn({
        [className ?? '']: !!className,
        [styles.badge]: showColor,
        [styles[`badge--${modifier}`]]: showColor,
      })}
    >
      {category}
    </span>
  );
}
