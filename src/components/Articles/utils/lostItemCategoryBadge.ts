import { CATEGORY_BADGE_COLOR } from 'static/lostItem';

export function getCategoryBadgeStyle(category: string) {
  const color = CATEGORY_BADGE_COLOR[category];

  return color ? { backgroundColor: color.background, color: color.text } : undefined;
}
