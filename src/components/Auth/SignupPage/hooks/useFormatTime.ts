function FormatTime(totalSeconds: number) {
  if (typeof totalSeconds !== 'number') return '';

  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export default FormatTime;
