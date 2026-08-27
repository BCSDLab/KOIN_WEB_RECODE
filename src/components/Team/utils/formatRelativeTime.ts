const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const formatRelativeTime = (createdAt: string, now: Date): string => {
  const created = new Date(createdAt.replace(' ', 'T'));

  if (Number.isNaN(created.getTime())) {
    return '';
  }

  const elapsed = now.getTime() - created.getTime();

  if (elapsed < MINUTE_MS) {
    return '방금 전';
  }

  if (elapsed < HOUR_MS) {
    return `${Math.floor(elapsed / MINUTE_MS)}분 전`;
  }

  if (elapsed < DAY_MS) {
    return `${Math.floor(elapsed / HOUR_MS)}시간 전`;
  }

  return `${Math.floor(elapsed / DAY_MS)}일 전`;
};

export default formatRelativeTime;
