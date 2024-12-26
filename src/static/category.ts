export type SubmenuTitle = '공지사항' | '버스' | '식단' | '시간표' | '복덕방' | '주변상점' | '교내 시설물 정보' | '코인 사장님' | '리뷰 작성하기' | '리뷰 수정하기' | '리뷰 신고하기' | '전화 주문 혜택';// 헤더에 리뷰 신고하기 제목 추가

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
        link: '/board/notice',
        newFlag: false,
        planFlag: false,
        tag: null,
      },
      {
        title: '버스',
        link: '/bus/route',
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
        title: '교내 시설물 정보',
        link: '/campusinfo',
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
        link: '/report/review', // 리뷰 신고하기 제목을 위한 추가
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
