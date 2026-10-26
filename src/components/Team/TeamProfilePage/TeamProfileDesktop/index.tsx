import type { FunctionComponent, SVGProps } from 'react';

import ChevronRightIcon from 'assets/svg/Team/chevron-right-icon.svg';
import ListEndIcon from 'assets/svg/Team/list-end-icon.svg';
import NoteIcon from 'assets/svg/Team/note-icon.svg';
import UserIcon from 'assets/svg/Team/profile-avatar-icon.svg';
import type { TeamProfileViewProps } from 'components/Team/TeamProfilePage/types';

import styles from './TeamProfileDesktop.module.scss';

interface MenuCardProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  onCardClick: () => void;
}

function MenuCard({ icon: Icon, title, description, onCardClick }: MenuCardProps) {
  return (
    <button type="button" className={styles['menu-card']} onClick={onCardClick}>
      <span className={styles['menu-card__icon']}>
        <Icon aria-hidden />
      </span>
      <span className={styles['menu-card__body']}>
        <span className={styles['menu-card__title']}>{title}</span>
        <span className={styles['menu-card__description']}>{description}</span>
      </span>
      <ChevronRightIcon aria-hidden className={styles['menu-card__chevron']} />
    </button>
  );
}

export default function TeamProfileDesktop({
  profile,
  hasProfile,
  onModifyClick,
  onCreateClick,
  onCreatedRecruitmentsClick,
  onAppliedRecruitmentsClick,
}: TeamProfileViewProps) {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.title}>팀원 모집 프로필</h1>

        <div className={styles.body}>
          {profile ? (
            <div className={styles['summary-panel']}>
              <div className={styles['summary-panel__profile']}>
                <span className={styles['summary-panel__avatar']}>
                  <UserIcon aria-hidden />
                </span>
                <div className={styles['summary-panel__info']}>
                  <p className={styles['summary-panel__nickname']}>{profile.profile_nickname}</p>
                  <ul className={styles['summary-panel__meta']}>
                    <li>{profile.department}</li>
                    {/* sentry-mask: Session Replay에서 학번을 가리기 위한 Sentry 기본 마스킹 클래스 */}
                    <li className="sentry-mask">{profile.student_number}</li>
                  </ul>
                </div>
              </div>
              <button type="button" className={styles['summary-panel__button']} onClick={onModifyClick}>
                프로필 수정하기
              </button>
            </div>
          ) : (
            <div className={styles['empty-panel']}>
              <p className={styles['empty-panel__title']}>아직 팀원 모집 프로필을 작성하지 않았어요.</p>
              <p className={styles['empty-panel__description']}>
                프로필을 작성하면 지원 시 더 빠르고 편리하게 활동할 수 있어요.
              </p>
              <button type="button" className={styles['empty-panel__button']} onClick={onCreateClick}>
                프로필 작성하기
              </button>
            </div>
          )}

          <div className={styles['menu-list']}>
            <MenuCard
              icon={NoteIcon}
              title={hasProfile ? '내가 작성한 모집글' : '내가 작성한 모집글 모아보기'}
              description="작성자 모집글과 지원자를 한눈에 확인할 수 있어요."
              onCardClick={onCreatedRecruitmentsClick}
            />
            <MenuCard
              icon={ListEndIcon}
              title={hasProfile ? '내가 지원한 모집글' : '내가 지원한 모집글 모아보기'}
              description="지원한 모집글과 지원 상태를 확인할 수 있어요."
              onCardClick={onAppliedRecruitmentsClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
