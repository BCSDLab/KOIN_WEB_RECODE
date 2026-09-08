import isValidCalendarDate from 'components/Team/utils/isValidCalendarDate';
import { z } from 'zod';

interface ActivityDateRange {
  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
}

// 지원서 작성 / 프로필 양쪽의 활동 이력 스키마가 공유하는 시작일 · 종료일 검증 규칙.
export function validateActivityDateRange(activity: ActivityDateRange, context: z.RefinementCtx) {
  const today = new Date().toISOString().slice(0, 10);

  if (isValidCalendarDate(activity.startDate) && activity.startDate > today) {
    context.addIssue({ code: 'custom', path: ['startDate'], message: '활동 시작일은 오늘 이전으로 선택해주세요.' });
  }

  if (activity.isOngoing) return;

  if (!activity.endDate) {
    context.addIssue({ code: 'custom', path: ['endDate'], message: '활동 종료일을 선택하거나 진행 중을 선택해주세요.' });
    return;
  }
  if (!isValidCalendarDate(activity.endDate)) {
    context.addIssue({ code: 'custom', path: ['endDate'], message: '활동 종료일이 올바르지 않습니다.' });
    return;
  }
  if (activity.endDate > today) {
    context.addIssue({ code: 'custom', path: ['endDate'], message: '활동 종료일은 오늘 이전으로 선택해주세요.' });
    return;
  }
  if (activity.endDate < activity.startDate) {
    context.addIssue({ code: 'custom', path: ['endDate'], message: '활동 종료일은 시작일 이후로 선택해주세요.' });
  }
}
