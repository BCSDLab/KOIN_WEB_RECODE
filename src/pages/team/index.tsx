import { useState } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';

import { teamQueries } from 'api/team/queries';
import Layout from 'components/layout';
import RecruitmentCard from 'components/Team/components/RecruitmentCard';
import TeamListHeader from 'components/Team/components/TeamListHeader';
import TeamSearchBar from 'components/Team/components/TeamSearchBar';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
import type {
  TeamRecruitmentCategory,
  TeamRecruitmentListRequest,
  TeamRecruitmentMeetingType,
  TeamRecruitmentStatus,
} from 'api/team/entity';

import styles from './TeamListPage.module.scss';

const CATEGORY_LABEL: Record<TeamRecruitmentCategory, string> = {
  CONTEST: '공모전',
  EXTERNAL_ACTIVITY: '대외활동',
  STUDY: '스터디',
  PROJECT: '프로젝트',
  OTHER: '기타',
};

const MEETING_TYPE_LABEL: Record<TeamRecruitmentMeetingType, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
  MIXED: '온 · 오프라인',
};

const formatDate = (date: string) => date.replace(/-/g, '.');

const formatRecruitmentStatus = (status: TeamRecruitmentStatus, dDay: number | null) => {
  if (status === 'CLOSED' || status === 'DELETED') {
    return '모집완료';
  }

  if (dDay === null) {
    return '모집 중';
  }

  if (dDay <= 0) {
    return 'D-Day';
  }

  return `D-${dDay}`;
};

export default function TeamListPage() {
  const token = useTokenState();
  const isMobile = useMediaQuery();

  const [searchTitle, setSearchTitle] = useState('');
  const [requestParams, setRequestParams] = useState<TeamRecruitmentListRequest>({
    status: 'ALL',
    sort: 'LATEST_DESC',
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError } = useQuery(teamQueries.list(requestParams, token));

  const recruitments = data?.recruitments ?? [];
  const totalCount = data?.total_count ?? 0;

  const handleSearch = () => {
    const keyword = searchTitle.trim();

    setRequestParams((previous) => ({
      ...previous,
      keyword: keyword || undefined,
      page: 1,
    }));
  };

  return (
    <>
      <Head>
        <title>팀원 모집 | KOIN</title>
        <meta name="description" content="한국기술교육대학교 팀원 모집 게시글을 확인하고 검색할 수 있습니다." />
      </Head>

      {isMobile && <TeamListHeader />}

      <main>
        {!isMobile && <h1>팀원 모집</h1>}
        <TeamSearchBar value={searchTitle} onChange={setSearchTitle} onSearch={handleSearch} />

        <p>전체({totalCount})</p>

        {isLoading && <p>모집글을 불러오는 중입니다.</p>}

        {isError && <p>모집글을 불러오지 못했습니다.</p>}

        {!isLoading && !isError && recruitments.length === 0 && <p>조건에 맞는 모집글이 없어요.</p>}

        {!isLoading &&
          !isError &&
          recruitments.map((recruitment) => (
            <RecruitmentCard
              key={recruitment.id}
              category={CATEGORY_LABEL[recruitment.category]}
              status={formatRecruitmentStatus(recruitment.status, recruitment.d_day)}
              title={recruitment.title}
              roles={recruitment.roles.map((role) => `${role.name} ${role.max_participants}명`)}
              location={MEETING_TYPE_LABEL[recruitment.meeting_type]}
              period={`${formatDate(recruitment.activity_start_date)} ~ ${formatDate(recruitment.activity_end_date)}`}
              currentMemberCount={recruitment.current_participants}
              maxMemberCount={recruitment.max_participants}
            />
          ))}

        <button type="button" className={styles.recruitButton}>
          모집하기
        </button>
      </main>
    </>
  );
}

TeamListPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
