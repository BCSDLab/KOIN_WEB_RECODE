import { useQuery } from '@tanstack/react-query';
import { calculateGraduationCredits } from 'api/graduationCalculator';

export default function useCalculateCredits(token: string) {
  return useQuery({
    queryKey: ['creditsByCourseType'],
    queryFn: () => (token ? calculateGraduationCredits(token) : null),
  });
}
