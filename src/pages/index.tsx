import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { isKoinError } from '@bcsdlab/koin';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getArticles, getLostItemStat } from 'api/articles';
import { getBannerCategoryList, getBanners } from 'api/banner';
import { getHotClub } from 'api/club';
import { HotClubResponse } from 'api/club/entity';
import { getStoreCategories } from 'api/store';
import { getMySemester, getSemesterInfoList, getTimetableFrame, getTimetableLectureInfo } from 'api/timetable';
import IndexArticles from 'components/IndexComponents/IndexArticles';
import IndexBus from 'components/IndexComponents/IndexBus';
import IndexCafeteria from 'components/IndexComponents/IndexCafeteria';
import IndexCallvan from 'components/IndexComponents/IndexCallvan';
import IndexLostItem from 'components/IndexComponents/IndexLostItem';
import IndexStore from 'components/IndexComponents/IndexStore';
import IndexTimetable from 'components/IndexComponents/IndexTimetable';
import { SSRLayout } from 'components/layout';
import { MY_SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useMySemester';
import { SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useSemesterOptionList';
import { TIMETABLE_FRAME_KEY } from 'components/TimetablePage/hooks/useTimetableFrameList';
import { TIMETABLE_INFO_LIST } from 'components/TimetablePage/hooks/useTimetableInfoList';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';
import { COOKIE_KEY } from 'static/url';
import { getRecentSemester } from 'utils/timetable/semester';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { clearServerAuthCookies, isServerAuthError } from 'utils/ts/ssrAuth';
import styles from './IndexPage.module.scss';

const getHotClubData = async () => {
  try {
    return await getHotClub();
  } catch (e) {
    if (isKoinError(e) && e.status === 404) {
      return {
        club_id: -1,
        name: '인기 동아리가 없어요',
        image_url: '',
      } satisfies HotClubResponse;
    }
    throw e;
  }
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  let token = parseServerSideParams(context).token ?? '';
  let userType = context.req.cookies[COOKIE_KEY.AUTH_USER_TYPE] || '';

  const resetAuthContext = () => {
    token = '';
    userType = '';
    clearServerAuthCookies(context);
  };

  const fetchMySemester = async () => {
    if (!token || userType !== 'STUDENT') return null;

    try {
      return await queryClient.fetchQuery({
        queryKey: [MY_SEMESTER_INFO_KEY],
        queryFn: () => getMySemester(token),
      });
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
    Promise.all([getBannerCategoryList(), getStoreCategories(), getHotClubData(), fetchMySemester()]),
    queryClient.prefetchQuery({
      queryKey: ['articles', '1'],
      queryFn: () => getArticles(token, '1'),
    }),
    queryClient.prefetchQuery({
      queryKey: [SEMESTER_INFO_KEY],
      queryFn: getSemesterInfoList,
    }),
    queryClient.prefetchQuery({
      queryKey: ['lostItemStat'],
      queryFn: getLostItemStat,
    }),
  ]);

  const userSemester = mySemester?.semesters?.[0] || getRecentSemester();

  const bannerCategoryId = Number(banners.banner_categories[0].id);
  const bannersList = await getBanners(bannerCategoryId);
  const isBannerOpen =
    context.req.cookies['HIDE_BANNER'] !== `modal_category_${bannerCategoryId}` && bannersList.count !== 0;

  if (token && userType === 'STUDENT') {
    try {
      const timetableFrameList = await queryClient.fetchQuery({
        queryKey: [TIMETABLE_FRAME_KEY + userSemester.year + userSemester.term],
        queryFn: () => getTimetableFrame(token, userSemester),
      });
      const mainFrame = timetableFrameList.find((frame) => frame.is_main);
      const activeMainFrameId = mainFrame?.id;
      if (typeof activeMainFrameId === 'number') {
        await queryClient.prefetchQuery({
          queryKey: [TIMETABLE_INFO_LIST, activeMainFrameId],
          queryFn: () => getTimetableLectureInfo(token, activeMainFrameId),
        });
      }
    } catch (error) {
      if (isServerAuthError(error)) {
        resetAuthContext();
      } else if (!(isKoinError(error) && error.status === 403)) {
        throw error;
      }
    }
  }

  return {
    props: {
      bannerCategoryId,
      bannersList,
      isBannerOpen,
      categories,
      hotClubInfo,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

function Index({
  bannersList,
  categories,
  // hotClubInfo,
  bannerCategoryId,
  isBannerOpen,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className={styles.template}>
      <Banner bannersList={bannersList} bannerCategoryId={bannerCategoryId} isBannerOpen={isBannerOpen} />
      <UserInfoModal />
      <div className={styles['left-container']}>
        <IndexStore categories={categories} />
        <IndexBus />
        <IndexCallvan />
        <IndexLostItem />
        <IndexArticles />
      </div>
      <div className={styles['right-container']}>
        <IndexTimetable />
        <IndexCafeteria />
      </div>
    </main>
  );
}

export default Index;

Index.getLayout = (page: React.ReactNode) => <SSRLayout>{page}</SSRLayout>;
