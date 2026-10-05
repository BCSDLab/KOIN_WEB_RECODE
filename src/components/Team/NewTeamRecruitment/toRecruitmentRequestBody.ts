import { getYyyyMmDd } from 'utils/ts/calendar';
import type { TeamRecruitmentFormValues } from './schema';
import type { TeamRecruitmentProgressType } from './types';
import type { TeamRecruitmentCategory, TeamRecruitmentMeetingType, TeamRecruitmentUpdateRequest } from 'api/team/entity';

export const CATEGORY_BY_LABEL: Record<string, TeamRecruitmentCategory> = {
  공모전: 'CONTEST',
  대외활동: 'EXTERNAL_ACTIVITY',
  스터디: 'STUDY',
  프로젝트: 'PROJECT',
  기타: 'OTHER',
};

export const MEETING_TYPE_BY_PROGRESS_TYPE: Record<TeamRecruitmentProgressType, TeamRecruitmentMeetingType> = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  HYBRID: 'MIXED',
};

export default function toRecruitmentRequestBody(values: TeamRecruitmentFormValues): TeamRecruitmentUpdateRequest {
  if (
    !values.category ||
    !values.progressType ||
    !values.activityStartDate ||
    !values.activityEndDate ||
    !values.deadlineDate
  ) {
    throw new Error('필수 모집글 정보가 누락되었습니다.');
  }

  const common = {
    category: CATEGORY_BY_LABEL[values.category],
    title: values.title.trim(),
    meeting_type: MEETING_TYPE_BY_PROGRESS_TYPE[values.progressType],
    activity_start_date: getYyyyMmDd(values.activityStartDate),
    activity_end_date: getYyyyMmDd(values.activityEndDate),
    deadline_date: getYyyyMmDd(values.deadlineDate),
    description: values.description.trim(),
    related_url: values.relatedUrl.trim() || null,
    qualification: values.qualification.trim() || null,
  };

  if (values.isRoleUnified) {
    return {
      ...common,
      recruitment_type: 'GENERAL',
      max_participants: values.unifiedMemberCount,
      roles: [],
    };
  }

  return {
    ...common,
    recruitment_type: 'ROLE_BASED',
    roles: values.roles.map((role) => ({
      ...(role.id !== undefined && { id: role.id }),
      name: role.name.trim(),
      max_participants: role.memberCount,
    })),
  };
}
