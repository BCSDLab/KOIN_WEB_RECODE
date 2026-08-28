import { useState } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import { useInfiniteQuery } from '@tanstack/react-query';

import { teamQueries } from 'api/team/queries';
import EmptyRecruitment from 'assets/svg/Team/empty-recruitment.svg';
import FilterIcon from 'assets/svg/Team/filter.svg';
import PencilIcon from 'assets/svg/Team/pencil.svg';
import Layout from 'components/layout';
import RecruitmentCard from 'components/Team/components/RecruitmentCard';
import TeamListHeader from 'components/Team/components/TeamListHeader';
import TeamSearchBar from 'components/Team/components/TeamSearchBar';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';
import type { TeamRecruitmentListRequest } from 'api/team/entity';

import styles from './TeamListPage.module.scss';

type TeamListFilter = Omit<TeamRecruitmentListRequest, 'page' | 'limit'>;

export default function TeamListPage() {
  const token = useTokenState();
  const isMobile = useMediaQuery();
  const logger = useLogger();

  const [searchTitle, setSearchTitle] = useState('');
  const [requestParams, setRequestParams] = useState<TeamListFilter>({
    status: 'ALL',
    sort: 'LATEST_DESC',
  });

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    teamQueries.infiniteList(requestParams, token),
  );

  const recruitments = data?.pages.flatMap((page) => page.recruitments) ?? [];
  const totalCount = data?.pages[0]?.total_count ?? 0;

  const scrollTriggerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleSearch = () => {
    const keyword = searchTitle.trim();

    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_search', value: keyword });

    setRequestParams((previous) => ({
      ...previous,
      keyword: keyword || undefined,
    }));
  };

  return (
    <>
      <Head>
        <title>팀원 모집 | KOIN</title>
        <meta name="description" content="한국기술교육대학교 팀원 모집 게시글을 확인하고 검색할 수 있습니다." />
      </Head>

      {isMobile && <TeamListHeader />}

      <main className={styles.page}>
        {!isMobile && <h1>팀원모집</h1>}

        <div className={styles.searchRow}>
          <TeamSearchBar value={searchTitle} onChange={setSearchTitle} onSearch={handleSearch} />

          <button type="button" className={styles.filterButton}>
            <span className={styles.filterButton__label}>필터</span>
            <FilterIcon />
          </button>
        </div>

        <p className={styles.totalCount}>전체({totalCount})</p>

        <div className={styles.content}>
          {isLoading && <p>모집글을 불러오는 중입니다.</p>}

          {!isLoading && (isError || recruitments.length === 0) && (
            <div className={styles.empty}>
              <EmptyRecruitment />
              <p className={styles.empty__message}>
                {isError ? '모집글을 불러오지 못했습니다.' : '조건에 맞는 모집글이 없어요.'}
              </p>
            </div>
          )}

          {!isLoading && !isError && recruitments.length > 0 && (
            <div className={styles.list}>
              {recruitments.map((recruitment) => (
                <RecruitmentCard key={recruitment.id} recruitment={recruitment} />
              ))}

              {isFetchingNextPage && <p className={styles.loadingIndicator}>모집글을 불러오는 중입니다.</p>}

              <div ref={scrollTriggerRef} className={styles.scrollTrigger} />
            </div>
          )}
        </div>

        <button type="button" className={styles.fab}>
          <span className={styles.fab__label}>모집하기</span>
          <PencilIcon />
        </button>
      </main>
    </>
  );
}

TeamListPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
