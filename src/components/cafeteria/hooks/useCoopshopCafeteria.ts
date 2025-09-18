import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshop } from 'api';

const COOPSHOP_CAFETERIA_KEY = 'COOPSHOP_CAFETERIA_KEY';

function useCoopshopCafeteria() {
  const { data: cafeteriaInfo } = useSuspenseQuery(
    {
      queryKey: [COOPSHOP_CAFETERIA_KEY],
      queryFn: () => coopshop.getCafeteriaInfo(),
    },
  );
  return { cafeteriaInfo };
}

export default useCoopshopCafeteria;
