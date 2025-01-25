import ROUTES from './routes';

export type SubmenuTitle = '공지사항' | '버스 교통편' | '버스 시간표' | '식단' | '시간표' | '복덕방' | '주변상점' | '교내 시설물 정보' | '코인 사장님' | '리뷰 작성하기' | '리뷰 수정하기' | '리뷰 신고하기' | '전화 주문 혜택';

export interface Submenu {
  title: SubmenuTitle;
  link: string;
  newFlag: boolean;
  planFlag: boolean;
  tag: number | null;
  openInNewTab?: boolean;
  stageLink?: string;
}

export type CategoryTitle = '서비스';

export interface Category {
  title: CategoryTitle;
  planFlag: boolean;
  submenu: Submenu[]
}

export const CATEGORY: Category[] = [
  {
    title: '서비스',
    planFlag: false,
    submenu: [
      {
        title: '공지사항',
        link: ROUTES.Articles(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '버스 교통편',
        link: ROUTES.BusRoute(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '버스 시간표',
        link: ROUTES.BusCourse(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '식단',
        link: ROUTES.Cafeteria(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '시간표',
        link: ROUTES.Timetable(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '복덕방',
        link: ROUTES.Room(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '주변상점',
        link: ROUTES.Store(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '교내 시설물 정보',
        link: ROUTES.CampusInfo(),
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '코인 사장님',
        link: 'https://owner.koreatech.in/',
        newFlag: true,
        planFlag: false,
        tag: null,
        openInNewTab: true,
        stageLink: 'https://owner.stage.koreatech.in',
      },
      {
        title: '리뷰 작성하기',
        link: '/review/',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '리뷰 수정하기',
        link: '/edit/',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '리뷰 신고하기',
        link: '/report/review',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '전화 주문 혜택',
        link: '/benefitstore',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
    ],
  },
];
