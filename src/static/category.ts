export type SubmenuTitle = '공지사항' | '버스/교통' | '식단' | '시간표' | '복덕방' | '주변상점' | '코인 for Business' | '리뷰 작성하기' | '리뷰 신고하기';

export interface Submenu {
  title: SubmenuTitle;
  link: string;
  newFlag: boolean;
  planFlag: boolean;
  tag: number | null;
  openInNewTab?: boolean;
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
        link: '/board/notice',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '버스/교통',
        link: '/bus',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '식단',
        link: '/cafeteria',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '시간표',
        link: '/timetable',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '복덕방',
        link: '/room',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '주변상점',
        link: '/store',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '코인 for Business',
        link: 'https://owner.koreatech.in/',
        newFlag: true,
        planFlag: false,
        tag: null,
        openInNewTab: true,
      },
      {
        title: '리뷰 작성하기',
        link: '/review/',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '리뷰 신고하기',
        link: '/review/report',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      // {
      //   title: "FAQ",
      //   link: "/faq",
      //   newFlag: false,
      //   planFlag: false,
      //   tag: null
      // },
      // {
      //   title: "동아리",
      //   link: "/circle",
      //   newFlag: false,
      //   planFlag: false,
      //   tag: null
      // },
    ],
  },
  /* {
    title: '공지사항',
    planFlag: false,
    submenu: [
      {
        title: "자유게시판",
        link: "/board/free",
        tag: 1,
        newFlag: false,
        planFlag: false
      },
      {
        title: "취업게시판",
        link: "/board/job",
        newFlag: false,
        tag: 2,
        planFlag: false
      },
      {
        title: "익명게시판",
        tag: -1, //원래 3
        link: "/board/anonymous",
        newFlag: false,
        planFlag: false
      },
      {
        title: "질문게시판",
        tag: 10,
        link: "/board/question",
        newFlag: false,
        planFlag: false
      },
      {
        title: '분실물',
        tag: 5,
        link: '/lost',
        newFlag: false,
        planFlag: false
      },
      {
        title: '홍보게시판',
        tag: 6,
        link: '/board/promotion',
        newFlag: true,
        planFlag: false
      }
    ],
  },
  {
    'title': '평가시스템',
    'planFlag': true,
    'submenu': [
      {
        'title': '교수 평가',
        'tag': null,
        'link': '',
        'newFlag': false,
        'planFlag': true
      },
      {
        'title': '강의 평가',
        'tag': null,
        'link': '',
        'newFlag': false,
        'planFlag': true
      }
    ]
  },
  {
    title: "중고장터",
    newFlag: false,
    planFlag: false,
    submenu: [
      {
        title: "팝니다",
        tag: null,
        link: "/market/sell",
        newFlag: false,
        planFlag: false
      },
      {
        title: "삽니다",
        tag: null,
        link: "/market/buy",
        newFlag: false,
        planFlag: false
      }
    ]
  },
  {
    'title': '부동산',
    'planFlag': true,
    'submenu': [
      {
        'title': '원룸정보',
        'tag': null,
        'link': 'room-list',
        'newFlag': false,
        'planFlag': false
      },
      {
        'title': '거래게시판',
        'tag': null,
        'link': '',
        'newFlag': false,
        'planFlag': true
      }
    ]
  }
  */
];
