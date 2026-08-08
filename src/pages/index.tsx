import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { articleQueries } from 'api/articles/queries';
import { authQueries } from 'api/auth/queries';
import { bannerQueries } from 'api/banner/queries';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import { clubQueries } from 'api/club/queries';
import { storeQueries } from 'api/store/queries';
import { createDefaultTimetableFrameList, timetableQueries, timetableQueryKeys } from 'api/timetable/queries';
import { convertDateToSimpleString, DiningTime } from 'components/cafeteria/utils/time';
import HomePage from 'components/IndexComponents/HomePage';
import HomeLayout from 'components/layout/HomeLayout';
import { COOKIE_KEY } from 'static/url';
import { getRecentSemester, resolveTimetableSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { clearServerAuthCookies, isServerAuthError } from 'utils/ts/ssrAuth';
import { withCacheControl } from 'utils/ts/withCacheControl';
import type { Semester } from 'api/timetable/entity';
import type { UserType } from 'utils/zustand/auth';

export const getServerSideProps = withCacheControl(async (context: GetServerSidePropsContext, cacheControl) => {
  const queryClient = new QueryClient();
  let token = parseServerSideParams(context).token ?? '';
  let userType = context.req.cookies[COOKIE_KEY.AUTH_USER_TYPE] || '';

  const resetAuthContext = () => {
    token = '';
    userType = '';
    clearServerAuthCookies(context);
  };

  const setDefaultTimetableFrameList = (semester: Semester = getRecentSemester()) => {
    queryClient.setQueryData(timetableQueryKeys.frameList(semester), createDefaultTimetableFrameList());
  };

  const fetchMySemester = async () => {
    if (!token || userType !== 'STUDENT') return null;

    try {
      return await queryClient.fetchQuery(timetableQueries.mySemester(token, { userType }));
    } catch (error) {
      if (isServerAuthError(error)) {
        resetAuthContext();
        return null;
      }
      if (isKoinError(error) && error.status === 403) {
        return null;
      }
      throw error;
    }
  };

  const serverNow = new Date();
  const diningTime = new DiningTime();
  const diningDate = diningTime.generateDiningDate();
  const serverDining = {
    type: diningTime.getType(),
    dayLabel: diningTime.isTodayDining() ? '오늘' : '내일',
    date: diningDate.toISOString(),
  };

  const [[banners, categories, hotClubInfo, mySemester]] = await Promise.all([
    Promise.all([
      queryClient.fetchQuery(bannerQueries.categories()),
      queryClient.fetchQuery(storeQueries.categories()),
      queryClient.fetchQuery(clubQueries.hot()),
      fetchMySemester(),
    ]),
    queryClient.prefetchQuery(articleQueries.list(token, '1')),
    queryClient.prefetchQuery(timetableQueries.semesterInfo()),
    queryClient.prefetchQuery(articleQueries.lostItemStat()),
    // prefetch가 없으면 IndexCafeteria(useSuspenseQuery)는 SSR에서 "미제공"을 그리고,
    // 클라이언트가 그 DOM을 통째로 갈아치운다.
    queryClient.prefetchQuery(cafeteriaQueries.dinings(convertDateToSimpleString(diningDate))),
  ]);

  if (token) {
    // MobileHomeRedesign의 인사말이 사용자 이름에 의존한다. prefetch가 없으면 서버는
    // 기본값('코리')을 그리고 클라이언트가 실제 이름으로 바꾸면서 트리 전체가 재생성된다.
    await queryClient.prefetchQuery(authQueries.userInfo(token, userType as UserType));
  }

  const userSemester = mySemester?.semesters?.[0];
  // 학기는 URL → 사용자 학기 → 날짜 폴백 순으로 서버가 확정한다. 클라이언트가 마운트 후
  // 다시 정하면 쿼리 키가 바뀌어 시간표가 통째로 교체된다.
  const serverSemester = resolveTimetableSemester(undefined, undefined, userSemester) ?? getRecentSemester();

  const bannerCategoryId = Number(banners.banner_categories[0].id);
  const bannersList = await queryClient.fetchQuery(bannerQueries.list(bannerCategoryId));

  if (token && userType === 'STUDENT') {
    if (!userSemester) {
      setDefaultTimetableFrameList();
    } else {
      try {
        const timetableFrameList = await queryClient.fetchQuery(
          timetableQueries.frameList(token, userSemester, { userType }),
        );
        const mainFrame = timetableFrameList.find((frame) => frame.is_main);
        const activeMainFrameId = mainFrame?.id;
        if (typeof activeMainFrameId === 'number') {
          await queryClient.prefetchQuery(timetableQueries.lectureInfo(token, activeMainFrameId));
        }
      } catch (error) {
        if (isServerAuthError(error)) {
          resetAuthContext();
        } else if (isKoinError(error) && (error.status === 403 || error.status === 404)) {
          setDefaultTimetableFrameList(userSemester);
        } else {
          throw error;
        }
      }
    }
  }

  if (!token) {
    cacheControl.enablePublicCache();
  }

  return {
    props: {
      bannerCategoryId,
      bannersList,
      categories,
      hotClubInfo,
      serverDining,
      serverSemester,
      serverNow: serverNow.toISOString(),
      dehydratedState: dehydrate(queryClient),
    },
  };
});

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <HomePage {...props} />;
}

export default Index;

Index.getLayout = (page: React.ReactNode) => <HomeLayout>{page}</HomeLayout>;
