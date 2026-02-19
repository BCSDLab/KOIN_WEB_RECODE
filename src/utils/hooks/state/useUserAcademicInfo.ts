import { useSuspenseQuery } from '@tanstack/react-query';
import { getUserAcademicInfo } from 'api/auth';
import useTokenState from './useTokenState';

export default function useUserAcademicInfo() {
  const token = useTokenState();

  return useSuspenseQuery({
    queryKey: ['userAcademicinfo'],

    queryFn: () => (token ? getUserAcademicInfo(token) : null),
  });
}
