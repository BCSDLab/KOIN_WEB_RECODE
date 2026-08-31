import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { teamMutations } from 'api/team/mutations';
import useTeamAuthGuard from 'components/Team/hooks/useTeamAuthGuard';
import NewTeamRecruitment from 'components/Team/NewTeamRecruitment';
import toRecruitmentRequestBody from 'components/Team/NewTeamRecruitment/toRecruitmentRequestBody';
import ROUTES from 'static/routes';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import type { TeamRecruitmentFormValues } from 'components/Team/NewTeamRecruitment/schema';

export default function CreateTeamRecruitment() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useTokenState();
  const { isAuthReady } = useTeamAuthGuard();
  const { mutateAsync: createRecruitment } = useMutation(teamMutations.createRecruitment(queryClient, token));

  const handleSubmit = async (values: TeamRecruitmentFormValues) => {
    try {
      const { id } = await createRecruitment(toRecruitmentRequestBody(values));
      showToast('success', '모집글이 등록되었습니다.');
      await router.replace(ROUTES.TeamDetail({ postId: String(id) }));
    } catch (error) {
      showToast('error', '모집글을 등록하지 못했어요. 다시 시도해 주세요.');
      throw error;
    }
  };

  if (!isAuthReady) return null;

  return <NewTeamRecruitment onSubmit={handleSubmit} />;
}
