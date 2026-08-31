import type { FunctionComponent, SVGProps } from 'react';
import SleepMascotIcon from 'assets/svg/common/sleep-bbico.svg';
import ChevronRightIcon from 'assets/svg/Team/chevron-right-icon.svg';
import ListEndIcon from 'assets/svg/Team/list-end-icon.svg';
import NoteIcon from 'assets/svg/Team/note-icon.svg';
import UserIcon from 'assets/svg/Team/profile-avatar-icon.svg';
import SubPageHeader from 'components/ui/SubPageHeader';
import type { TeamProfileViewProps } from 'components/Team/TeamProfilePage/types';
import styles from './TeamProfileMobile.module.scss';

interface MenuCardProps {
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  onCardClick: () => void;
}

function MenuCard({ icon: Icon, title, description, onCardClick }: MenuCardProps) {
  return (
    <button type="button" className={styles.menuCard} onClick={onCardClick}>
      <span className={styles.menuCard__icon}>
        <Icon aria-hidden />
      </span>
      <span className={styles.menuCard__body}>
        <span className={styles.menuCard__title}>{title}</span>
        <span className={styles.menuCard__description}>{description}</span>
      </span>
      <ChevronRightIcon aria-hidden className={styles.menuCard__chevron} />
    </button>
  );
}

export default function TeamProfileMobile({
  profile,
  hasProfile,
  onModifyClick,
  onCreateClick,
  onCreatedRecruitmentsClick,
  onAppliedRecruitmentsClick,
}: TeamProfileViewProps) {
  return (
    <div className={styles.page}>
      <SubPageHeader title="팀원 모집 프로필" />

      <div className={styles.page__content}>
        {profile ? (
          <div className={styles.summaryCard}>
            <span className={styles.summaryCard__avatar}>
              <UserIcon aria-hidden />
            </span>
            <div className={styles.summaryCard__body}>
              <p className={styles.summaryCard__nickname}>{profile.profile_nickname}</p>
              <ul className={styles.summaryCard__meta}>
                <li>{profile.department}</li>
                <li>{profile.student_number}</li>
              </ul>
              <button type="button" className={styles.summaryCard__button} onClick={onModifyClick}>
                프로필 수정하기
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <SleepMascotIcon aria-hidden className={styles.emptyCard__mascot} />
            <p className={styles.emptyCard__title}>아직 팀원 모집 프로필을 작성하지 않았어요.</p>
            <p className={styles.emptyCard__description}>
              프로필을 작성하면 지원 시 더 빠르고 편리하게 활동할 수 있어요.
            </p>
            <button type="button" className={styles.emptyCard__button} onClick={onCreateClick}>
              프로필 작성하기
            </button>
          </div>
        )}

        <div className={styles.menuList}>
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
  );
}
