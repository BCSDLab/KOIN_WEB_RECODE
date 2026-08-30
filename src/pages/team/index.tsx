import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from '@tanstack/react-query';

import { teamQueries, type TeamRecruitmentInfiniteListRequest } from 'api/team/queries';
import EmptyRecruitment from 'assets/svg/common/sleep-bbico.svg';
import FilterIcon from 'assets/svg/Team/filter.svg';
import PencilIcon from 'assets/svg/Team/pencil.svg';
import XIcon from 'assets/svg/Team/x.svg';
import Layout from 'components/layout';
import RecruitmentCard from 'components/Team/components/RecruitmentCard';
import RecruitmentFilterPanel, {
  DEFAULT_TEAM_RECRUITMENT_FILTER,
  TEAM_RECRUITMENT_FILTER_CATEGORY_OPTIONS,
  TEAM_RECRUITMENT_FILTER_MEETING_TYPE_OPTIONS,
  TEAM_RECRUITMENT_FILTER_SORT_OPTIONS,
  TEAM_RECRUITMENT_FILTER_STATUS_OPTIONS,
  type TeamRecruitmentFilter,
} from 'components/Team/components/RecruitmentFilterPanel';
import TeamListHeader from 'components/Team/components/TeamListHeader';
import SearchBar from 'components/ui/SearchBar';
import ROUTES from 'static/routes';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useTokenState from 'utils/hooks/state/useTokenState';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';
import { redirectToLogin } from 'utils/ts/auth';
import styles from './TeamListPage.module.scss';

interface AppliedFilterChipProps {
  label: string;
  onRemove: () => void;
}

function AppliedFilterChip({ label, onRemove }: AppliedFilterChipProps) {
  return (
    <button type="button" className={styles.appliedFilterChip} onClick={onRemove} aria-label={`${label} 필터 해제`}>
      <span>{label}</span>
      <XIcon aria-hidden />
    </button>
  );
}

const getFilterLabel = <T extends string>(options: { value: T; label: string }[], value: T) =>
  options.find((option) => option.value === value)?.label ?? value;

export default function TeamListPage() {
  const router = useRouter();
  const token = useTokenState();
  const isMobile = useMediaQuery();
  const logger = useLogger();

  const [searchTitle, setSearchTitle] = useState('');
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState<TeamRecruitmentFilter>(() => ({
    ...DEFAULT_TEAM_RECRUITMENT_FILTER,
    categories: [],
  }));

  const requestParams = useMemo<TeamRecruitmentInfiniteListRequest>(
    () => ({
      ...(searchKeyword && { keyword: searchKeyword }),
      status: appliedFilter.status,
      ...(appliedFilter.categories.length > 0 && { categories: appliedFilter.categories }),
      ...(appliedFilter.meetingType && { meetingType: appliedFilter.meetingType }),
      sort: appliedFilter.sort,
    }),
    [appliedFilter, searchKeyword],
  );

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    teamQueries.infiniteList(requestParams, token),
  );

  const recruitments = data?.pages.flatMap((page) => page.recruitments) ?? [];
  const totalCount = data?.pages[0]?.total_count ?? 0;

  const scrollTriggerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const handleSearch = () => {
    const keyword = searchTitle.trim();

    logger.actionEventClick({ team: 'CAMPUS', event_label: 'team_recruitment_search', value: keyword });
    setSearchKeyword(keyword || undefined);
  };

  const handleFilterApply = (filter: TeamRecruitmentFilter) => {
    setAppliedFilter(filter);
  };

  const hasAppliedFilter =
    appliedFilter.status !== DEFAULT_TEAM_RECRUITMENT_FILTER.status ||
    appliedFilter.categories.length > 0 ||
    appliedFilter.meetingType !== DEFAULT_TEAM_RECRUITMENT_FILTER.meetingType ||
    appliedFilter.sort !== DEFAULT_TEAM_RECRUITMENT_FILTER.sort;

  const handleRecruitClick = () => {
    logger.actionEventClick({
      team: 'CAMPUS',
      event_category: 'click',
      event_label: 'team_recruitment_recruit',
      value: '모집하기',
    });

    if (!token) {
      redirectToLogin(router.asPath);
      return;
    }
    router.push(ROUTES.TeamRecruitmentNew());
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
          <SearchBar
            value={searchTitle}
            onChange={setSearchTitle}
            onSearch={handleSearch}
            label="팀원 모집 검색"
            size="small"
          />

          <button
            type="button"
            className={styles.filterButton}
            onClick={() => setIsFilterOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isFilterOpen}
          >
            <span className={styles.filterButton__label}>필터</span>
            <FilterIcon />
          </button>
        </div>

        {hasAppliedFilter && (
          <div className={styles.appliedFilters}>
            {appliedFilter.status !== DEFAULT_TEAM_RECRUITMENT_FILTER.status && (
              <AppliedFilterChip
                label={getFilterLabel(TEAM_RECRUITMENT_FILTER_STATUS_OPTIONS, appliedFilter.status)}
                onRemove={() => setAppliedFilter((previous) => ({ ...previous, status: 'ALL' }))}
              />
            )}

            {appliedFilter.sort !== DEFAULT_TEAM_RECRUITMENT_FILTER.sort && (
              <AppliedFilterChip
                label={getFilterLabel(TEAM_RECRUITMENT_FILTER_SORT_OPTIONS, appliedFilter.sort)}
                onRemove={() => setAppliedFilter((previous) => ({ ...previous, sort: 'LATEST_DESC' }))}
              />
            )}

            {appliedFilter.categories.map((category) => (
              <AppliedFilterChip
                key={category}
                label={getFilterLabel(TEAM_RECRUITMENT_FILTER_CATEGORY_OPTIONS, category)}
                onRemove={() =>
                  setAppliedFilter((previous) => ({
                    ...previous,
                    categories: previous.categories.filter((item) => item !== category),
                  }))
                }
              />
            ))}

            {appliedFilter.meetingType && (
              <AppliedFilterChip
                label={getFilterLabel(TEAM_RECRUITMENT_FILTER_MEETING_TYPE_OPTIONS, appliedFilter.meetingType)}
                onRemove={() => setAppliedFilter((previous) => ({ ...previous, meetingType: undefined }))}
              />
            )}
          </div>
        )}

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
                <RecruitmentCard
                  key={recruitment.id}
                  recruitment={recruitment}
                  eventLabel="team_recruitment_post_select"
                />
              ))}

              {isFetchingNextPage && <p className={styles.loadingIndicator}>모집글을 불러오는 중입니다.</p>}

              <div ref={scrollTriggerRef} className={styles.scrollTrigger} />
            </div>
          )}
        </div>

        <button type="button" className={styles.fab} onClick={handleRecruitClick}>
          <span className={styles.fab__label}>모집하기</span>
          <PencilIcon />
        </button>
      </main>

      <RecruitmentFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filter={appliedFilter}
        onApply={handleFilterApply}
      />
    </>
  );
}

TeamListPage.getLayout = (page: ReactNode) => <Layout hideLayout>{page}</Layout>;
