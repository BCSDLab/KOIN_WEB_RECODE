type ROUTESParams<T extends string = string> = {
  [key in T]?: string;
};

const ROUTES = {
  Main: () => '/',
  NotFound: () => '*',
  Timetable: () => '/timetable',
  TimetableModify: ({ id, type }: ROUTESParams<'id' | 'type'>) =>
    `timetable/modify?id=${id}${type ? `&type=${type}` : ''}`,
  GraduationCalculator: () => '/graduation',
  Store: () => '/store',
  BenefitStore: () => '/benefitstore',
  StoreDetail: ({ id }: ROUTESParams<'id'>) => `/store/${id}`,
  BusRoute: () => '/bus/route',
  BusCourseShuttle: () => '/bus/shuttle',
  BusCourseExpress: () => '/bus/express',
  BusCourseCity: () => '/bus/city',
  Club: () => '/clubs',
  ClubDetail: ({ id, hot }: ROUTESParams<'id' | 'hot'>) => `/clubs/${id}?hot=${hot}`,
  NewClub: () => '/clubs/new',
  ClubEdit: ({ id }: ROUTESParams<'id'>) => `/clubs/edit/${id}`,
  NewClubRecruitment: ({ id }: ROUTESParams<'id'>) => `/clubs/recruitment/${id}`,
  ClubRecruitmentEdit: ({ id }: ROUTESParams<'id'>) => `/clubs/recruitment/edit/${id}`,
  NewClubEvent: ({ id }: ROUTESParams<'id'>) => `/clubs/event/${id}`,
  ClubEventEdit: ({ id, eventId }: ROUTESParams<'id' | 'eventId'>) =>
    `/clubs/${id}/event/edit/${eventId}`,
  Cafeteria: () => '/cafeteria',
  Articles: () => '/articles',
  ArticlesDetail: ({ id }: ROUTESParams<'id'>) => `/articles/${id}`,
  LostItems: () => '/lost-item',
  LostItemRedirect: () => '/lost-item',
  LostItemDetail: ({ id }: ROUTESParams<'id'>) => `/lost-item/${id}`,
  LostItemFound: () => '/lost-item/found',
  LostItemLost: () => '/lost-item/lost',
  LostItemChat: () => '/lost-item/chat',
  LostItemEdit: ({ id }: ROUTESParams<'id'>) => `/lost-item/edit/${id}`,
  LostItemReport: ({ id }: ROUTESParams<'id'>) => `/lost-item/report/${id}`,
  Room: () => '/room',
  RoomDetail: ({ id }: ROUTESParams<'id'>) => `/room/${id}`,
  CampusInfo: () => '/campusinfo',
  Auth: () => '/auth',
  AuthSignup: ({ currentStep }: ROUTESParams<'currentStep'>) =>
    `/auth/signup/${currentStep}`,
  AuthFindPW: ({ step }: ROUTESParams<'step'>) => `/auth/findpw/${step}`,
  // AuthFindPW: () => '/auth/findpw',
  AuthFindID: () => '/auth/findid',
  Phone: () => '/auth/findid/phone',
  Email: () => '/auth/findid/email',
  IDResult: () => '/auth/findid/result',
  AuthModifyInfo: () => '/auth/modifyinfo',
  Review: ({ id }: ROUTESParams<'id'>) => `/store/review/${id}`,
  ReviewEdit: ({ id, reviewId }: ROUTESParams<'id' | 'reviewId'>) =>
    `/store/review/edit/${id}/${reviewId}`,
  ReviewReport: ({ shopid, reviewid }: ROUTESParams<'shopid' | 'reviewid'>) =>
    `/report/review/shopid/${shopid}/reviewid/${reviewid}`,
  Webview: () => '/webview',
  WebviewCampusInfo: () => '/webview/campusinfo',
  PrivatePolicy: () => '/policy',
  Inquiry: () => 'https://forms.gle/qYw17r2kihThiJvj7',
};

export default ROUTES;
