import { useSuspenseQuery } from '@tanstack/react-query';
import { graduationCalculator } from 'api';

export default function useCalculateCredits(token: string) {
  return useSuspenseQuery({
    queryKey: ['creditsByCourseType'],
    queryFn: () => graduationCalculator.calculateGraduationCredits(token),
  });
}
