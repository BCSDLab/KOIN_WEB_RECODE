type ROUTESParams<T extends string = string> = {
  [key in T]?: string;
} & {
  /**
   * 경로가 네비게이션(ex. `Link`, `navigate`)에 사용되는지 여부를 나타냅니다.
   * - `true`일 경우, `Link`나 `navigate`를 사용할 때 동적 링크 생성을 의미합니다.
   * - `false`일 경우, `App.tsx`에서 경로를 정의할 때 사용됩니다.
   */
  isLink: boolean;
};

const ROUTES = {
  Main: () => '/',
  NotFound: () => '*',
  Timetable: () => '/timetable',
  TimetableRegular: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `timetable/modify/regular/${id}` : 'timetable/modify/regular/:id'),
  TimetableDirect: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `timetable/modify/direct/${id}` : 'timetable/modify/direct/:id'),
  GraduationCalculator: () => '/graduation',
  Store: () => '/store',
  BenefitStore: () => '/benefitstore',
  StoreDetail: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `/store/${id}` : '/store/:id'),
  BusRoute: () => '/bus/route',
  BusCourse: () => '/bus/course',
  Cafeteria: () => '/cafeteria',
  Articles: () => '/articles',
  ArticlesDetail: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `/articles/${id}` : '/articles/:id'),
  ArtilesReport: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `/articles/report/${id}` : '/articles/report/:id'),
  LostItemRedirect: () => '/articles/lost-item',
  LostItemDetail: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `/articles/lost-item/${id}` : '/articles/lost-item/:id'),
  LostItemFound: () => '/lost-item/found',
  LostItemLost: () => '/lost-item/lost',
  LostItemChat: () => '/articles/lost-item/chat',
  Room: () => '/room',
  RoomDetail: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `/room/${id}` : '/room/:id'),
  CampusInfo: () => '/campusinfo',
  Auth: () => '/auth',
  AuthSignup: ({ currentStep, isLink }: ROUTESParams<'currentStep'>) => (isLink ? `/auth/signup/${currentStep}` : '/auth/signup/:currentStep'),
  AuthFindPW: () => '/auth/findpw',
  AuthModifyInfo: () => '/auth/modifyinfo',
  Review: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `/review/${id}` : '/review/:id'),
  ReviewEdit: ({ id, isLink }: ROUTESParams<'id'>) => (isLink ? `/edit/review/${id}` : '/edit/review/:id'),
  ReviewReport: ({
    shopid,
    reviewid,
    isLink,
  }: ROUTESParams<'shopid' | 'reviewid'>) => (isLink ? `/report/review/shopid/${shopid}/reviewid/${reviewid}`
    : '/report/review/shopid/:shopid/reviewid/:reviewid'),
  Webview: () => '/webview',
  WebviewCampusInfo: () => '/webview/campusinfo',
  PrivatePolicy: () => '/policy',
  Inquiry: () => 'https://forms.gle/qYw17r2kihThiJvj7',
};

export default ROUTES;
