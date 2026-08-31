import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { teamMutations } from 'api/team/mutations';
import { teamQueries } from 'api/team/queries';
import CalendarIcon from 'assets/svg/Team/calendar.svg';
import ClockIcon from 'assets/svg/Team/clock.svg';
import LocationIcon from 'assets/svg/Team/location.svg';
import PeopleIcon from 'assets/svg/Team/people.svg';
import ProfileIcon from 'assets/svg/Team/profile.svg';
import LoginRequiredModal from 'components/modal/LoginRequiredModal';
import DeleteConfirmModal from 'components/Team/components/DeleteConfirmModal';
import OwnerActionMenu from 'components/Team/components/OwnerActionMenu';
import { RecruitmentBadges } from 'components/Team/components/RecruitmentCard';
import { formatRecruitmentDate, MEETING_TYPE_LABEL } from 'components/Team/utils/recruitmentDisplay';
import SubPageHeader from 'components/ui/SubPageHeader';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import type { TeamRecruitmentDetailResponse } from 'api/team/entity';
import styles from './RecruitmentDetail.module.scss';

const formatCreatedAt = (createdAt: string) => formatRecruitmentDate(createdAt.split(' ')[0]);

type PrimaryActionType = 'apply' | 'profile' | 'login' | 'chat' | 'manage' | 'disabled';

interface PrimaryAction {
  type: PrimaryActionType;
  label: string;
}

const getPrimaryAction = (recruitment: TeamRecruitmentDetailResponse): PrimaryAction => {
  if (recruitment.is_author || recruitment.can_manage_applicants) {
    return { type: 'manage', label: '지원자 확인하기' };
  }

  if (recruitment.team_chat_available && recruitment.team_chat_room_id !== null) {
    return { type: 'chat', label: '채팅하기' };
  }

  if (
    recruitment.status !== 'RECRUITING' ||
    recruitment.apply_block_reason === 'RECRUITMENT_CLOSED' ||
    recruitment.apply_block_reason === 'DEADLINE_PASSED' ||
    recruitment.apply_block_reason === 'ROLE_CLOSED' ||
    recruitment.apply_block_reason === 'RECRUITMENT_DELETED'
  ) {
    return { type: 'disabled', label: '모집 마감' };
  }

  if (recruitment.can_apply) {
    return { type: 'apply', label: '지원하기' };
  }

  if (recruitment.apply_block_reason === 'LOGIN_REQUIRED') {
    return { type: 'login', label: '지원하기' };
  }

  if (recruitment.apply_block_reason === 'PROFILE_REQUIRED') {
    return { type: 'profile', label: '지원하기' };
  }

  if (recruitment.application || recruitment.apply_block_reason === 'ALREADY_APPLIED') {
    return { type: 'disabled', label: '지원 완료' };
  }

  return { type: 'disabled', label: '지원 불가' };
};

interface DetailContentProps {
  recruitment: TeamRecruitmentDetailResponse;
  onEdit: () => void;
  onDelete: () => void;
}

function DetailContent({ recruitment, onEdit, onDelete }: DetailContentProps) {
  const router = useRouter();
  const logger = useLogger();
  const [isLoginModalOpen, openLoginModal, closeLoginModal] = useBooleanState(false);
  const primaryAction = getPrimaryAction(recruitment);
  const isActionDisabled = primaryAction.type === 'disabled';
  const isClosed = recruitment.status !== 'RECRUITING';
  const canManage = recruitment.is_author || recruitment.can_manage_applicants;
  const roles =
    recruitment.roles.length > 0
      ? recruitment.roles
      : [
          {
            id: 0,
            name: '전체',
            current_participants: recruitment.current_participants,
            max_participants: recruitment.max_participants,
            is_closed: isClosed,
          },
        ];

  const handleManageClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_applicant_check',
      value: recruitment.title,
    });
    router.push(ROUTES.TeamRecruitmentApplicants({ postId: String(recruitment.id) }));
  };

  const handleActionClick = () => {
    if (primaryAction.type === 'apply' || primaryAction.type === 'login' || primaryAction.type === 'profile') {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'team_recruitment_post_apply',
        value: recruitment.title,
      });
    }

    if (primaryAction.type === 'manage') {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: 'team_recruitment_post_applicant_check',
        value: recruitment.title,
      });
    }

    if (primaryAction.type === 'login') {
      openLoginModal();
      return;
    }

    if (primaryAction.type === 'profile') {
      router.push(ROUTES.TeamProfileCreate());
      return;
    }

    if (primaryAction.type === 'apply') {
      router.push(ROUTES.TeamRecruitmentApply({ postId: String(recruitment.id) }));
      return;
    }

    if (primaryAction.type === 'manage') {
      router.push(ROUTES.TeamRecruitmentApplicants({ postId: String(recruitment.id) }));
      return;
    }

    if (primaryAction.type === 'chat' && recruitment.team_chat_room_id !== null) {
      router.push(
        ROUTES.TeamChat({
          recruitmentId: String(recruitment.id),
          chatRoomId: String(recruitment.team_chat_room_id),
        }),
      );
    }
  };

  return (
    <>
      <main className={styles.content}>
        <h1 className={styles.title}>모집글 상세</h1>
        <div className={styles.summaryRow}>
          <section className={cn({ [styles.summary]: true, [styles['summary--inline']]: canManage })}>
            <RecruitmentBadges category={recruitment.category} status={recruitment.status} dDay={recruitment.d_day} />
            <h2 className={styles.summary__title}>{recruitment.title}</h2>
          </section>
          {canManage && (
            <button type="button" className={styles.manageButton} onClick={handleManageClick}>
              지원자 관리
            </button>
          )}
        </div>
        <div className={styles.divider} />
        <div className={styles.body}>
          <div className={styles.body__main}>
            <section className={styles.section}>
              <h3 className={styles.section__title}>모집 소개</h3>
              <p className={styles.section__text}>{recruitment.description}</p>
            </section>
            {recruitment.qualification && (
              <section className={styles.section}>
                <h3 className={styles.section__title}>지원 자격</h3>
                <p className={styles.section__text}>{recruitment.qualification}</p>
              </section>
            )}
            {recruitment.related_url && (
              <section className={styles.section}>
                <h3 className={styles.section__title}>관련 URL</h3>
                <a className={styles.section__link} href={recruitment.related_url} target="_blank" rel="noreferrer">
                  {recruitment.related_url}
                </a>
              </section>
            )}
          </div>
          <aside className={styles.body__aside}>
            <dl className={styles.information}>
              <div className={styles.information__row}>
                <dt className={styles.information__label}>
                  <span className={styles.information__icon}>
                    <LocationIcon />
                  </span>
                  진행 방식
                </dt>
                <dd className={styles.information__value}>{MEETING_TYPE_LABEL[recruitment.meeting_type]}</dd>
              </div>
              <div className={styles.information__row}>
                <dt className={styles.information__label}>
                  <span className={styles.information__icon}>
                    <CalendarIcon />
                  </span>
                  활동 기간
                </dt>
                <dd className={styles.information__value}>
                  {formatRecruitmentDate(recruitment.activity_start_date)} ~{' '}
                  {formatRecruitmentDate(recruitment.activity_end_date)}
                </dd>
              </div>
              <div className={styles.information__row}>
                <dt className={styles.information__label}>
                  <span className={styles.information__icon}>
                    <PeopleIcon />
                  </span>
                  모집 인원
                </dt>
                <dd className={styles.information__value}>
                  {recruitment.current_participants}/{recruitment.max_participants}명
                </dd>
              </div>
              <div className={styles.information__row}>
                <dt className={styles.information__label}>
                  <span className={styles.information__icon}>
                    <ClockIcon />
                  </span>
                  작성일
                </dt>
                <dd className={styles.information__value}>{formatCreatedAt(recruitment.created_at)}</dd>
              </div>
              <div className={styles.information__row}>
                <dt className={styles.information__label}>
                  <span className={styles.information__icon}>
                    <ProfileIcon />
                  </span>
                  작성자
                </dt>
                <dd className={styles.information__value}>{recruitment.author_nickname}</dd>
              </div>
            </dl>
            <section className={styles.roleCard}>
              <h3 className={styles.section__title}>모집 역할 및 인원</h3>
              <div className={styles.roles}>
                {roles.map((role) => (
                  <div className={styles.roles__row} key={role.id}>
                    <span className={styles.roles__name}>
                      <span className={styles.roles__bullet} />
                      {role.name}
                    </span>
                    <span className={styles.roles__count}>
                      {role.is_closed ? '모집 마감' : `${role.max_participants}명`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
      <div className={cn({ [styles.action]: true, [styles['action--mobileOnly']]: canManage })}>
        <button type="button" className={styles.action__button} disabled={isActionDisabled} onClick={handleActionClick}>
          {primaryAction.label}
        </button>
      </div>
      {recruitment.is_author && (
        <div className={styles.ownerActions}>
          <button type="button" className={styles.ownerActions__edit} onClick={onEdit}>
            수정
          </button>
          <button type="button" className={styles.ownerActions__delete} onClick={onDelete}>
            삭제
          </button>
        </div>
      )}
      {isLoginModalOpen && (
        <LoginRequiredModal
          title="팀원 모집에 지원하기"
          description="로그인 후 지원할 수 있습니다."
          onClose={closeLoginModal}
        />
      )}
    </>
  );
}

export default function RecruitmentDetail() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logger = useLogger();
  const token = useTokenState();
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useBooleanState(false);
  const postId = Array.isArray(router.query.postId) ? router.query.postId[0] : router.query.postId;
  const recruitmentId = Number(postId);
  const isValidRecruitmentId = Number.isInteger(recruitmentId) && recruitmentId > 0;
  const { data, isLoading, isError } = useQuery({
    ...teamQueries.detail(recruitmentId, token),
    enabled: router.isReady && isValidRecruitmentId,
  });
  const { mutate: deleteRecruitment, isPending: isDeletePending } = useMutation(
    teamMutations.deleteRecruitment(queryClient, token ?? ''),
  );

  const handleEdit = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_edit',
      value: '편집하기',
    });
    router.push(ROUTES.TeamRecruitmentEdit({ postId: String(recruitmentId) }));
  };

  const handleDeleteClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_delete',
      value: '삭제하기',
    });
    openDeleteModal();
  };

  const handleDeleteCancel = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_delete_cancel',
      value: '취소하기',
    });
    closeDeleteModal();
  };

  const handleDeleteConfirm = () => {
    if (!isValidRecruitmentId) return;

    logger.actionEventClick({
      team: 'CAMPUS',
      event_label: 'team_recruitment_post_delete_confirm',
      value: '삭제하기',
    });
    deleteRecruitment(recruitmentId, {
      onSuccess: () => {
        closeDeleteModal();
        showToast('success', '모집글이 삭제되었습니다.');
        router.replace(ROUTES.Team());
      },
      onError: () => showToast('error', '모집글을 삭제하지 못했어요. 다시 시도해 주세요.'),
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.mobileHeader}>
        <SubPageHeader
          title="팀원 모집"
          rightAction={
            data?.is_author ? <OwnerActionMenu onEdit={handleEdit} onDelete={handleDeleteClick} /> : undefined
          }
        />
      </div>
      {(!router.isReady || isLoading) && <p className={styles.state}>모집글을 불러오는 중입니다.</p>}
      {router.isReady && !data && (!isValidRecruitmentId || isError) && (
        <p className={styles.state}>모집글을 불러오지 못했습니다.</p>
      )}
      {data && <DetailContent recruitment={data} onEdit={handleEdit} onDelete={handleDeleteClick} />}

      {data?.is_author && isDeleteModalOpen && (
        <DeleteConfirmModal
          isPending={isDeletePending}
          onCancel={handleDeleteCancel}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
