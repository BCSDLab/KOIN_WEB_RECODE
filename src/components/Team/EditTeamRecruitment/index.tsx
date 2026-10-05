import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import NewTeamRecruitment from 'components/Team/NewTeamRecruitment';
import toRecruitmentRequestBody from 'components/Team/NewTeamRecruitment/toRecruitmentRequestBody';
import { CATEGORY_LABEL } from 'components/Team/utils/recruitmentDisplay';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import type { TeamRecruitmentDetailResponse, TeamRecruitmentMeetingType } from 'api/team/entity';
import type { TeamRecruitmentFormValues } from 'components/Team/NewTeamRecruitment/schema';
import type { TeamRecruitmentProgressType } from 'components/Team/NewTeamRecruitment/types';
import styles from './EditTeamRecruitment.module.scss';

const PROGRESS_TYPE_BY_MEETING_TYPE: Record<TeamRecruitmentMeetingType, TeamRecruitmentProgressType> = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  MIXED: 'HYBRID',
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
      await updateRecruitment(toRecruitmentRequestBody(values));
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

  return (
    <NewTeamRecruitment
      key={recruitmentId}
      mode="edit"
      initialValues={toFormValues(data)}
      onSubmit={handleSubmit}
    />
  );
}
