import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next/dist/types';
import { isKoinError } from '@bcsdlab/koin';
import { QueryClient } from '@tanstack/react-query';
import { club, articles as articlesApi, banner, timetable } from 'api';
import { getBannerCategoryList } from 'api/banner';
import { HotClubResponse } from 'api/club/entity';
import { getStoreCategories } from 'api/store';

import IndexArticles from 'components/IndexComponents/IndexArticles';
import IndexBus from 'components/IndexComponents/IndexBus';
import IndexCafeteria from 'components/IndexComponents/IndexCafeteria';
import IndexClub from 'components/IndexComponents/IndexClub';
import IndexStore from 'components/IndexComponents/IndexStore';
import IndexTimetable from 'components/IndexComponents/IndexTimetable';
import { MY_SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useMySemester';
import { SEMESTER_INFO_KEY } from 'components/TimetablePage/hooks/useSemesterOptionList';
import Banner from 'components/ui/Banner';
import UserInfoModal from 'components/ui/UserInfoModal';
import styles from './IndexPage.module.scss';

const getHotClub = async () => {
  try {
    return await club.getHotClub();
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
  const token = context.req.cookies['AUTH_TOKEN_KEY'] || '';
  const userType = context.req.cookies['USER_TYPE'] || '';
  const datas = await Promise.all([
    getBannerCategoryList(),
    getStoreCategories(),
    getHotClub(),
    queryClient.prefetchQuery({
      queryKey: ['articles'],
      queryFn: () => articlesApi.getArticles(token, '1'),
    }),
    queryClient.prefetchQuery({
      queryKey: [MY_SEMESTER_INFO_KEY],
      queryFn: () => (token && userType === 'STUDENT' ? timetable.getMySemester(token) : null),
    }),
    queryClient.prefetchQuery({
      queryKey: [SEMESTER_INFO_KEY],
      queryFn: timetable.getSemesterInfoList,
    }),
  ]);
  const banners = datas[0];
  const categories = datas[1];
  const hotClubInfo = datas[2];

  const bannerCategoryId = Number(banners.banner_categories[0].id);
  const bannersList = await banner.getBanners(bannerCategoryId);
  const isBannerOpen =
    context.req.cookies['HIDE_BANNER'] !== `modal_category_${bannerCategoryId}` && bannersList.count !== 0;

  return {
    props: {
      bannerCategoryId,
      bannersList,
      isBannerOpen,
      categories,
      hotClubInfo,
    },
  };
};

function Index({
  bannersList,
  categories,
  hotClubInfo,
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
        <IndexClub hotClubInfo={hotClubInfo} />
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
