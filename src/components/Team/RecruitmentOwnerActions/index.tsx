import { useRouter } from 'next/router';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import type { Portal } from 'components/modal/Modal/PortalProvider';
import DeleteConfirmModal from 'components/Team/components/DeleteConfirmModal';
import OwnerActionMenu from 'components/Team/components/OwnerActionMenu';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useModalPortal from 'utils/hooks/layout/useModalPortal';
import useIsLoggedIn from 'utils/hooks/state/useIsLoggedIn';
import showToast from 'utils/ts/showToast';

export function useRecruitmentDetail() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const postId = Array.isArray(router.query.postId) ? router.query.postId[0] : router.query.postId;
  const recruitmentId = Number(postId);
  const isValidRecruitmentId = Number.isInteger(recruitmentId) && recruitmentId > 0;
  const { data, isLoading, isError } = useQuery({
    ...teamQueries.detail(recruitmentId, isLoggedIn),
    enabled: router.isReady && isValidRecruitmentId,
  });

  return { data, isLoading, isError, recruitmentId, isValidRecruitmentId };
}

interface RecruitmentDeleteModalProps {
  recruitmentId: number;
  onClose: () => void;
}

function RecruitmentDeleteModal({ recruitmentId, onClose }: RecruitmentDeleteModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logger = useLogger();
  const { mutate: deleteRecruitment, isPending } = useMutation(teamMutations.deleteRecruitment(queryClient));

  const handleCancel = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_delete_cancel',
      value: '취소하기',
    });
    onClose();
  };

  const handleConfirm = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_delete_confirm',
      value: '삭제하기',
    });
    deleteRecruitment(recruitmentId, {
      onSuccess: () => {
        onClose();
        showToast('success', '모집글이 삭제되었습니다.');
        router.replace(ROUTES.Team());
      },
      onError: () => showToast('error', '모집글을 삭제하지 못했어요. 다시 시도해 주세요.'),
    });
  };

  return (
    <DeleteConfirmModal isPending={isPending} onCancel={handleCancel} onClose={onClose} onConfirm={handleConfirm} />
  );
}

export function useRecruitmentOwnerActions(recruitmentId: number) {
  const router = useRouter();
  const logger = useLogger();
  const portalManager = useModalPortal();

  const onEdit = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_edit',
      value: '편집하기',
    });
    router.push(ROUTES.TeamRecruitmentEdit({ postId: String(recruitmentId) }));
  };

  const onDelete = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_delete',
      value: '삭제하기',
    });
    portalManager.open((portalOption: Portal) => (
      <RecruitmentDeleteModal recruitmentId={recruitmentId} onClose={portalOption.close} />
    ));
  };

  return { onEdit, onDelete };
}

export function RecruitmentOwnerMenu() {
  const { data, recruitmentId } = useRecruitmentDetail();
  const { onEdit, onDelete } = useRecruitmentOwnerActions(recruitmentId);

  if (!data?.is_author) return null;

  return <OwnerActionMenu onEdit={onEdit} onDelete={onDelete} />;
}
