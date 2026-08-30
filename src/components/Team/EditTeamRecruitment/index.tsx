import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import NewTeamRecruitment from 'components/Team/NewTeamRecruitment';
import { CATEGORY_LABEL } from 'components/Team/utils/recruitmentDisplay';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import { getYyyyMmDd } from 'utils/ts/calendar';
import showToast from 'utils/ts/showToast';
import type {
  TeamRecruitmentCategory,
  TeamRecruitmentDetailResponse,
  TeamRecruitmentMeetingType,
  TeamRecruitmentUpdateRequest,
} from 'api/team/entity';
import type { TeamRecruitmentFormValues } from 'components/Team/NewTeamRecruitment/schema';
import type { TeamRecruitmentProgressType } from 'components/Team/NewTeamRecruitment/types';
import styles from './EditTeamRecruitment.module.scss';

const CATEGORY_BY_LABEL: Record<string, TeamRecruitmentCategory> = {
  공모전: 'CONTEST',
  대외활동: 'EXTERNAL_ACTIVITY',
  스터디: 'STUDY',
  프로젝트: 'PROJECT',
  기타: 'OTHER',
};

const PROGRESS_TYPE_BY_MEETING_TYPE: Record<TeamRecruitmentMeetingType, TeamRecruitmentProgressType> = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  MIXED: 'HYBRID',
};

const MEETING_TYPE_BY_PROGRESS_TYPE: Record<TeamRecruitmentProgressType, TeamRecruitmentMeetingType> = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  HYBRID: 'MIXED',
};

const parseApiDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const toFormValues = (recruitment: TeamRecruitmentDetailResponse): TeamRecruitmentFormValues => ({
  category: CATEGORY_LABEL[recruitment.category],
  title: recruitment.title,
  progressType: PROGRESS_TYPE_BY_MEETING_TYPE[recruitment.meeting_type],
  activityStartDate: parseApiDate(recruitment.activity_start_date),
  activityEndDate: parseApiDate(recruitment.activity_end_date),
  deadlineDate: parseApiDate(recruitment.deadline_date),
  isRoleUnified: recruitment.recruitment_type === 'GENERAL',
  roles: recruitment.roles.map((role) => ({
    id: role.id,
    name: role.name,
    memberCount: role.max_participants,
  })),
  unifiedMemberCount: recruitment.max_participants,
  description: recruitment.description,
  relatedUrl: recruitment.related_url ?? '',
  qualification: recruitment.qualification ?? '',
});

const toUpdateRequest = (values: TeamRecruitmentFormValues): TeamRecruitmentUpdateRequest => {
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
};

export default function EditTeamRecruitment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useTokenState();
  const postId = Array.isArray(router.query.postId) ? router.query.postId[0] : router.query.postId;
  const recruitmentId = Number(postId);
  const isValidRecruitmentId = Number.isInteger(recruitmentId) && recruitmentId > 0;
  const { data, isLoading, isError } = useQuery({
    ...teamQueries.detail(recruitmentId, token),
    enabled: router.isReady && isValidRecruitmentId,
  });
  const { mutateAsync: updateRecruitment } = useMutation(
    teamMutations.updateRecruitment(queryClient, token ?? '', recruitmentId),
  );

  const handleSubmit = async (values: TeamRecruitmentFormValues) => {
    try {
      await updateRecruitment(toUpdateRequest(values));
      showToast('success', '모집글이 수정되었습니다.');
      await router.replace(ROUTES.TeamDetail({ postId: String(recruitmentId) }));
    } catch (error) {
      showToast('error', '모집글을 수정하지 못했어요. 다시 시도해 주세요.');
      throw error;
    }
  };

  if (!router.isReady || isLoading) {
    return <p className={styles.state}>모집글을 불러오는 중입니다.</p>;
  }

  if (!isValidRecruitmentId || isError || !data) {
    return <p className={styles.state}>모집글을 불러오지 못했습니다.</p>;
  }

  if (!data.is_author) {
    return <p className={styles.state}>모집글을 수정할 권한이 없습니다.</p>;
  }

  return <NewTeamRecruitment mode="edit" initialValues={toFormValues(data)} onSubmit={handleSubmit} />;
}
