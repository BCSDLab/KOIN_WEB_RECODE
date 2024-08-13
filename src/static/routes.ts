const ROUTES = {
  Main: '/',
  Timetable: '/timetable',
  Store: '/store',
  StoreDetail: {
    path: '/store/:id',
    general: (id: number) => `/store/${id}`,
  },
  Bus: '/bus',
  Cafeteria: '/cafeteria',
  BoardNotice: '/board/notice',
  BoardNoticeDetail: {
    path: '/board/notice/:id',
    general: (id: number) => `/board/notice/${id}`,
  },
  Room: '/room',
  RoomDetail: {
    path: '/room/:id',
    general: (id: number) => `/room/${id}`,
  },
  Auth: '/auth',
  AuthSignup: '/auth/signup',
  AuthFindPW: '/auth/findpw',
  AuthModifyInfo: '/auth/modifyinfo',
  Review: {
    path: 'review/:id',
    general: (id: string) => `/review/${id}`,
  },
  ReviewEdit: {
    path: '/edit/review/:id',
    general: (id: string) => `/edit/review/${id}`,
  },
  ReviewReport: {
    path: '/report/review/shopid/:shopid/reviewid/:reviewid',
    general: (shopid: string, reviewid: number) => `/report/review/shopid/${shopid}/reviewid/${reviewid}`,
  },
};

export default ROUTES;
