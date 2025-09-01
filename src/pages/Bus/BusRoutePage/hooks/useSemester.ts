import { useSuspenseQuery } from '@tanstack/react-query';
import { coopshop } from 'api';

interface Semester {
  semester: string;
  startDate: string;
  endDate: string;
}

const useSemester = () => useSuspenseQuery({
  queryKey: ['semester'],
  queryFn: async () => coopshop.getAllShopInfo(),
  select: (data): Semester => ({
    semester: data.semester,
    startDate: data.from_date,
    endDate: data.to_date,
  }),
});

export default useSemester;
