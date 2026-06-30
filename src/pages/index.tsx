import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { articleQueries } from 'api/articles/queries';
import { bannerQueries } from 'api/banner/queries';
import { clubQueries } from 'api/club/queries';
import { storeQueries } from 'api/store/queries';
import { createDefaultTimetableFrameList, timetableQueries, timetableQueryKeys } from 'api/timetable/queries';
import IndexArticles from 'components/IndexComponents/IndexArticles';
import IndexBus from 'components/IndexComponents/IndexBus';
import IndexCafeteria from 'components/IndexComponents/IndexCafeteria';
import IndexCallvan from 'components/IndexComponents/IndexCallvan';
import IndexLostItem from 'components/IndexComponents/IndexLostItem';
import IndexStore from 'components/IndexComponents/IndexStore';
import IndexTimetable from 'components/IndexComponents/IndexTimetable';
import { SSRLayout } from 'components/layout';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';
import { COOKIE_KEY } from 'static/url';
import { getRecentSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { clearServerAuthCookies, isServerAuthError } from 'utils/ts/ssrAuth';
import { withCacheControl } from 'utils/ts/withCacheControl';
import type { Semester } from 'api/timetable/entity';
import styles from './IndexPage.module.scss';

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
  ]);

  const userSemester = mySemester?.semesters?.[0];

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
      dehydratedState: dehydrate(queryClient),
    },
  };
});

function Index(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <HomePage {...props} />;
}

export default Index;

Index.getLayout = (page: React.ReactNode) => <HomeLayout>{page}</HomeLayout>;
