import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { articleQueries } from 'api/articles/queries';
import { authQueries } from 'api/auth/queries';
import type { BannersResponse } from 'api/banner/entity';
import { bannerQueries } from 'api/banner/queries';
import { cafeteriaQueries } from 'api/cafeteria/queries';
import { callvanQueries } from 'api/callvan/queries';
import { coopshopQueries } from 'api/coopshop/queries';
import type { StoreCategoriesResponse } from 'api/store/entity';
import { storeQueries } from 'api/store/queries';
import type { Semester } from 'api/timetable/entity';
import { createDefaultTimetableFrameList, timetableQueries, timetableQueryKeys } from 'api/timetable/queries';
import { weatherQueries } from 'api/weather/queries';
import { convertDateToSimpleString, DiningTime } from 'components/cafeteria/utils/time';
import HomePage from 'components/IndexComponents/HomePage';
import HomeLayout from 'components/layout/HomeLayout';
import { getRecentSemester, resolveTimetableSemester } from 'utils/timetable/semester';
import { getDeviceClass } from 'utils/ts/serverRequestContext';
import { isServerAuthError } from 'utils/ts/ssrAuth';
import { withCacheControl } from 'utils/ts/withCacheControl';

export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext, cacheControl, serverRequest) => {
    const queryClient = new QueryClient();
    let isLoggedIn = serverRequest.isLoggedIn;
    let userType = serverRequest.userType;
    const isMobile = getDeviceClass(context.req.headers['user-agent']) === 'mobile';

    const resetAuthContext = () => {
      isLoggedIn = false;
      userType = null;
    };

    const setDefaultTimetableFrameList = (semester: Semester = getRecentSemester()) => {
      queryClient.setQueryData(timetableQueryKeys.frameList(semester, isLoggedIn), createDefaultTimetableFrameList());
    };

    const fetchMySemester = async () => {
      if (!isLoggedIn || userType !== 'STUDENT') return null;

      try {
        return await queryClient.fetchQuery(timetableQueries.mySemester(isLoggedIn, { userType }));
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

    const [mySemester] = await Promise.all([
      fetchMySemester(),
      queryClient.prefetchQuery(cafeteriaQueries.dinings(convertDateToSimpleString(diningDate))),
    ]);

    if (isLoggedIn) {
      await queryClient.prefetchQuery(authQueries.userInfo(true, userType));
    }

    const userSemester = mySemester?.semesters?.[0];
    const serverSemester = resolveTimetableSemester(undefined, undefined, userSemester) ?? getRecentSemester();

    let bannerCategoryId = 0;
    let bannersList: BannersResponse = { count: 0, banners: [] };
    let categories: StoreCategoriesResponse = { total_count: 0, shop_categories: [] };

    if (isMobile) {
      await Promise.all([
        queryClient.prefetchQuery(weatherQueries.info()),
        queryClient.prefetchQuery(
          callvanQueries.list({ statuses: ['RECRUITING'], sort: 'LATEST_DESC', page: 1, limit: 1 }),
        ),
        queryClient.prefetchQuery(storeQueries.counts()),
        queryClient.prefetchQuery(storeQueries.eventCount()),
        queryClient.prefetchQuery(coopshopQueries.cafeteriaInfo()),
      ]);
    } else {
      const [banners, categoriesResponse] = await Promise.all([
        queryClient.fetchQuery(bannerQueries.categories()),
        queryClient.fetchQuery(storeQueries.categories()),
        queryClient.prefetchQuery(articleQueries.list(isLoggedIn, '1')),
        queryClient.prefetchQuery(timetableQueries.semesterInfo()),
        queryClient.prefetchQuery(articleQueries.lostItemStat()),
      ]);
      categories = categoriesResponse;
      bannerCategoryId = Number(banners.banner_categories[0].id);
      bannersList = await queryClient.fetchQuery(bannerQueries.list(bannerCategoryId));

      if (isLoggedIn && userType === 'STUDENT') {
        if (!userSemester) {
          setDefaultTimetableFrameList();
        } else {
          try {
            const timetableFrameList = await queryClient.fetchQuery(
              timetableQueries.frameList(isLoggedIn, userSemester, { userType }),
            );
            const mainFrame = timetableFrameList.find((frame) => frame.is_main);
            const activeMainFrameId = mainFrame?.id;
            if (typeof activeMainFrameId === 'number') {
              await queryClient.prefetchQuery(timetableQueries.lectureInfo(isLoggedIn, activeMainFrameId));
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
    }

    if (!isLoggedIn) {
      cacheControl.enablePublicCache();
    }

    return {
      props: {
        bannerCategoryId,
        bannersList,
        categories,
        serverDining,
        serverSemester,
        serverNow: serverNow.toISOString(),
        dehydratedState: dehydrate(queryClient),
      },
    };
  },
);

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <HomePage {...props} />;
}

export default Index;

Index.getLayout = (page: React.ReactNode) => <HomeLayout>{page}</HomeLayout>;
