import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { teamQueries } from 'api/team/queries';
import CalendarIcon from 'assets/svg/Team/calendar.svg';
import ClockIcon from 'assets/svg/Team/clock.svg';
import LocationIcon from 'assets/svg/Team/location.svg';
import PeopleIcon from 'assets/svg/Team/people.svg';
import ProfileIcon from 'assets/svg/Team/profile.svg';
import { RecruitmentBadges } from 'components/Team/components/RecruitmentCard';
import { formatRecruitmentDate, MEETING_TYPE_LABEL } from 'components/Team/utils/recruitmentDisplay';
import SubPageHeader from 'components/ui/SubPageHeader';
import useTokenState from 'utils/hooks/state/useTokenState';
import type { TeamRecruitmentDetailResponse } from 'api/team/entity';
import styles from './RecruitmentDetail.module.scss';

const formatCreatedAt = (createdAt: string) => formatRecruitmentDate(createdAt.split(' ')[0]);

interface DetailContentProps {
  recruitment: TeamRecruitmentDetailResponse;
}

function DetailContent({ recruitment }: DetailContentProps) {
  const isClosed = recruitment.status !== 'RECRUITING';
  const actionLabel = isClosed ? '모집 마감' : recruitment.is_author ? '지원자 관리하기' : '지원하기';
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

  return (
    <>
      <main className={styles.content}>
        <section className={styles.summary}>
          <RecruitmentBadges
            category={recruitment.category}
            status={recruitment.status}
            dDay={recruitment.d_day}
          />
          <h2 className={styles.summary__title}>{recruitment.title}</h2>
        </section>

        <div className={styles.divider} />

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

        <section className={styles.section}>
          <h3 className={styles.section__title}>모집 역할 및 인원</h3>
          <div className={styles.roles}>
            {roles.map((role) => (
              <div className={styles.roles__row} key={role.id}>
                <span className={styles.roles__name}>
                  <span className={styles.roles__bullet} />
                  {role.name}
                </span>
                <span className={styles.roles__count}>{role.is_closed ? '모집 마감' : `${role.max_participants}명`}</span>
              </div>
            ))}
          </div>
        </section>

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
      </main>

      <div className={styles.action}>
        <button type="button" className={styles.action__button} disabled={isClosed}>
          {actionLabel}
        </button>
      </div>
    </>
  );
}

export default function RecruitmentDetail() {
  const router = useRouter();
  const token = useTokenState();
  const postId = Array.isArray(router.query.postId) ? router.query.postId[0] : router.query.postId;
  const recruitmentId = Number(postId);
  const isValidRecruitmentId = Number.isInteger(recruitmentId) && recruitmentId > 0;
  const { data, isLoading, isError } = useQuery({
    ...teamQueries.detail(recruitmentId, token),
    enabled: router.isReady && isValidRecruitmentId,
  });

  return (
    <div className={styles.page}>
      <SubPageHeader title="팀원 모집" />

      {(!router.isReady || isLoading) && <p className={styles.state}>모집글을 불러오는 중입니다.</p>}
      {router.isReady && (!isValidRecruitmentId || isError) && (
        <p className={styles.state}>모집글을 불러오지 못했습니다.</p>
      )}
      {data && <DetailContent recruitment={data} />}
    </div>
  );
}
