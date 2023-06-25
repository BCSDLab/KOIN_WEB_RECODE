export default function getDayOfWeek(): number {
  const today = new Date().getDay();

  if (today === 0) return 6;
  return today - 1;
}
