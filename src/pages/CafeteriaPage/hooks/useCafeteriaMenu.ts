import { useQuery } from 'react-query';
import cafeteria from 'api/cafeteria';

const useCafeteriaMenu = (date: string) => {
  const { data: cafeteriaMenu } = useQuery(
    ['cafeteriaMenu', date],
    ({ queryKey }) => cafeteria(queryKey[1]),
    {
      suspense: true,
      retry: 0,
    },
  );

  return cafeteriaMenu;
};

export default useCafeteriaMenu;
