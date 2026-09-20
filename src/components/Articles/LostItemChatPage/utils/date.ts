export const getKoreaISODate = () => {
  const TIME_DIFFERENCE = 9;
  const date = new Date();
  date.setHours(date.getHours() + TIME_DIFFERENCE);
  return date.toISOString();
};
