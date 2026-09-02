import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import useLogger from 'utils/hooks/analytics/useLogger';
import { getYyyyMmDd } from 'utils/ts/calendar';
import showToast from 'utils/ts/showToast';

export interface ActivityValue {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  isOngoing: boolean;
  content: string;
  status: 'draft' | 'saved';
  hasBeenSaved: boolean;
}

export interface ActivityValidationResult {
  success: boolean;
  message?: string;
}

interface ActivityHistoryFormValues {
  activities: ActivityValue[];
}

type ActivityDateField = 'startDate' | 'endDate';

interface OpenDatePicker {
  index: number;
  field: ActivityDateField;
}

interface ActivityHistoryLoggingTitle {
  ADD: string;
  EDIT: string;
  getDoneEvent: (hasBeenSaved: boolean) => { eventLabel: string; value: string };
}

let activitySequence = 0;

// crypto.randomUUID는 보안 컨텍스트가 아니면 undefined라 개발/스테이징 http 환경에서 터진다.
const createActivityId = () => {
  activitySequence += 1;
  return `activity-${Date.now()}-${activitySequence}`;
};

export default function useActivityHistoryField(
  loggingTitle: ActivityHistoryLoggingTitle,
  // 스키마 기반 검증(zod 등)을 쓰는 호출부는 이걸 넘긴다. 안 넘기면 아래 수동 검증을 그대로 쓴다.
  validateActivity?: (activity: ActivityValue) => ActivityValidationResult,
) {
  const { actionEventClick } = useLogger();
  const { control, register, getValues, setValue } = useFormContext<ActivityHistoryFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: 'activities' });
  const activities = useWatch({ control, name: 'activities' }) ?? [];
  const [openDatePicker, setOpenDatePicker] = useState<OpenDatePicker | null>(null);

  const handleAppend = () => {
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: loggingTitle.ADD,
      value: '활동 이력 추가',
    });
    append({
      id: createActivityId(),
      title: '',
      startDate: '',
      endDate: null,
      isOngoing: false,
      content: '',
      status: 'draft',
      hasBeenSaved: false,
    });
  };

  const handleRemove = (index: number) => {
    setOpenDatePicker(null);
    remove(index);
  };

  const handleEdit = (index: number) => {
    actionEventClick({ team: 'CAMPUS', event_category: 'click', event_label: loggingTitle.EDIT, value: '수정' });
    setValue(`activities.${index}.status`, 'draft');
  };

  const handleDone = (index: number) => {
    const activity = getValues(`activities.${index}`);

    if (validateActivity) {
      const result = validateActivity(activity);
      if (!result.success) {
        showToast('warning', result.message ?? '입력값을 확인해주세요.');
        return;
      }
    } else {
      // 검증 순서(제목→날짜→내용)는 두 페이지 중 하나로 통일한 것. 순서에 따라 여러 필드가
      // 비었을 때 어떤 경고 토스트가 먼저 뜨는지만 달라지고, 최종 검증 결과는 동일하다.
      if (!activity.title.trim()) {
        showToast('warning', '활동명을 작성해주세요.');
        return;
      }
      if (!activity.startDate) {
        showToast('warning', '활동 시작일을 선택해주세요.');
        return;
      }
      if (!activity.isOngoing && !activity.endDate) {
        showToast('warning', '활동 종료일을 선택하거나 진행 중을 선택해주세요.');
        return;
      }
      if (!activity.isOngoing && activity.endDate && activity.endDate < activity.startDate) {
        showToast('warning', '활동 종료일은 시작일 이후로 선택해주세요.');
        return;
      }
      if (!activity.content.trim()) {
        showToast('warning', '활동 내용을 작성해주세요.');
        return;
      }
    }

    const doneEvent = loggingTitle.getDoneEvent(activity.hasBeenSaved);
    actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: doneEvent.eventLabel,
      value: doneEvent.value,
    });
    setValue(`activities.${index}.status`, 'saved');
    setValue(`activities.${index}.hasBeenSaved`, true);
  };

  const handleToggleOngoing = (index: number, checked: boolean) => {
    setValue(`activities.${index}.isOngoing`, checked);
    if (checked) {
      setValue(`activities.${index}.endDate`, null);
    }
  };

  const handleDateSelect = (index: number, field: ActivityDateField) => (date: Date) => {
    setValue(`activities.${index}.${field}`, getYyyyMmDd(date));
  };

  const handleOpenDatePicker = (index: number, field: ActivityDateField) => {
    setOpenDatePicker({ index, field });
  };

  const handleCloseDatePicker = () => {
    setOpenDatePicker(null);
  };

  return {
    fields,
    activities,
    register,
    openDatePicker,
    handleAppend,
    handleRemove,
    handleEdit,
    handleDone,
    handleToggleOngoing,
    handleDateSelect,
    handleOpenDatePicker,
    handleCloseDatePicker,
  };
}
