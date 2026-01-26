const convertDate = (time: string) => {
  if (typeof time !== 'string') {
    return '';
  }
  return time.split(' ')[0].replaceAll('-', '.');
};

export const isNewArticle = (registeredAt: string, currentDate: Date) => {
  const registered = convertDate(registeredAt)
    .split('.')
    .map((item: string) => parseInt(item, 10));

  if (
    registered[0] - currentDate.getFullYear() === 0 &&
    registered[1] - currentDate.getMonth() === 1 &&
    currentDate.getDate() - registered[2] <= 4
  ) {
    return true;
  }
  return false;
};
