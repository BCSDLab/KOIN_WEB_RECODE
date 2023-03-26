export const leftPad = (value: number) => {
  if (value >= 10) {
    return value;
  }

  return `0${value}`;
}

const useDate = (nowDate = new Date(), delimiter = '') => {
  const year = nowDate.getFullYear();
  const month = leftPad(nowDate.getMonth() + 1);
  const day = leftPad(nowDate.getDate());

  return {
    date: new Date(year, Number(month), Number(day)),
    displayDate: [year, month, day].join(delimiter),
    apiDate: [String(year).slice(2, 3), month, day].join(''),
  };
};

export default useDate;
