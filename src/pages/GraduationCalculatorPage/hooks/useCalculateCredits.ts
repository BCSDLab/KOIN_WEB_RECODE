import { useQuery } from '@tanstack/react-query';
import { graduationCalculator } from 'api';

export default function useCalculateCredits(token: string) {
  const agreeGraduationCredits = localStorage.getItem('agreeGraduationCredits');

  return useQuery({
    queryKey: ['creditsByCourseType'],
    queryFn: () => (token ? graduationCalculator.calculateGraduationCredits(token) : null),
    enabled: !!agreeGraduationCredits,
  });
}
