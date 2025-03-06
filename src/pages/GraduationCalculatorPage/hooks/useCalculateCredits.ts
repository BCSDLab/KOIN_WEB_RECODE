import { useQuery } from '@tanstack/react-query';
import { graduationCalculator } from 'api';

export default function useCalculateCredits(token: string) {
  return useQuery({
    queryKey: ['creditsByCourseType'],
    queryFn: () => (token ? graduationCalculator.calculateGraduationCredits(token) : null),
  });
}
