import { useSuspenseQuery } from '@tanstack/react-query';
import { getCafeteriaInfo } from 'api/coopshop';

const COOPSHOP_CAFETERIA_KEY = 'COOPSHOP_CAFETERIA_KEY';

function useCoopshopCafeteria() {
  const { data: cafeteriaInfo } = useSuspenseQuery({
    queryKey: [COOPSHOP_CAFETERIA_KEY],
    queryFn: () => getCafeteriaInfo(),
  });
  return { cafeteriaInfo };
}

export default useCoopshopCafeteria;
