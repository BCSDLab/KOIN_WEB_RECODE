import { useSuspenseQuery } from '@tanstack/react-query';
import { auth } from 'api';
import useTokenState from './useTokenState';

export default function useUserAcademicInfo() {
  const token = useTokenState();

  return useSuspenseQuery({
    queryKey: ['userAcademicinfo'],

    queryFn: () => (token ? auth.getUserAcademicInfo(token) : null),
  });
}
