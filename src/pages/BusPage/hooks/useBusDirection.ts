import { ChangeEvent, useState } from 'react';
import { directionToEnglish } from 'pages/BusPage/ts/busTimeModules';

const useBusDirection = (directionList: string[]) => {
  const [depart, setDepart] = useState(directionList[0]);
  const [arrival, setArrival] = useState(directionList[1]);

  const changeDepart = (e: ChangeEvent<HTMLSelectElement>) => {
    setDepart(e.target.value);
    if (e.target.value === arrival) setArrival(depart);
  };

  const changeArrival = (e: ChangeEvent<HTMLSelectElement>) => {
    setArrival(e.target.value);
    if (e.target.value === depart) setDepart(arrival);
  };

  return {
    depart: {
      value: directionToEnglish(depart),
      options: [depart].concat(directionList.filter((name) => name !== depart)),
      handleChange: changeDepart,
    },
    arrival: {
      value: directionToEnglish(arrival),
      options: [arrival].concat(directionList.filter((name) => name !== arrival)),
      handleChange: changeArrival,
    },
  };
};

export default useBusDirection;
