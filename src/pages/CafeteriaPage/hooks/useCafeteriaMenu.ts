import { useQuery } from 'react-query';
import cafeteria from 'api/cafeteria';
import { CafeteriaMenu } from 'api/cafeteria/entity';

const useCafeteriaMenu = (date: string): CafeteriaMenu[] | 'isLoading' => {
  const { data: cafeteriaMenu, isLoading } = useQuery(
    ['cafeteriaMenu', date],
    ({ queryKey }) => cafeteria(queryKey[1]),
    {
      suspense: true,
      retry: 0,
    },
  );

  if (isLoading || cafeteriaMenu === undefined) return 'isLoading';
  console.log(cafeteriaMenu);
  return cafeteriaMenu;
};

export default useCafeteriaMenu;
