/* eslint-disable */
import { useEffect, ReactNode, Suspense } from 'react';
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import AuthPage from 'pages/Auth/AuthPage';
import LoginPage from 'pages/Auth/LoginPage';
import BoardPage from 'pages/BoardPage';
import StorePage from 'pages/Store/StorePage';
import ArticlesPage from 'pages/Articles/ArticlesPage';
import ArticleListPage from 'pages/Articles/ArticleListPage';
import ArticlesDetailPage from 'pages/Articles/ArticlesDetailPage';
import Toast from 'components/feedback/Toast';
import PageViewTracker from 'components/analytics/PageViewTracker';
import SignupPage from 'pages/Auth/SignupPage';
import FindPasswordPage from 'pages/Auth/FindPasswordPage';
import StoreDetailPage from 'pages/Store/StoreDetailPage';
import StoreBenefitPage from 'pages/Store/StoreBenefitPage';
import CampusInfo from 'pages/CampusInfo';
import BusRoutePage from 'pages/Bus/BusRoutePage';
import BusCoursePage from 'pages/Bus/BusCoursePage';
import ClubListPage from 'pages/Club/ClubListPage';
import ClubDetailPage from 'pages/Club/ClubDetailPage';
import NewClubPage from 'pages/Club/NewClubPage';
import IndexPage from 'pages/IndexPage';
import RoomPage from 'pages/Room/RoomPage';
import RoomDetailPage from 'pages/Room/RoomDetailPage';
import TimetablePage from 'pages/TimetablePage/MainTimetablePage';
import CafeteriaPage from 'pages/Cafeteria';
import ModifyInfoPage from 'pages/Auth/ModifyInfoPage';
import AddReviewPage from 'pages/Store/StoreReviewPage/AddReviewPage';
import EditReviewPage from 'pages/Store/StoreReviewPage/EditReviewPage';
import ReviewReportingPage from 'pages/Store/StoreDetailPage/components/Review/components/ReviewReporting';
import ModifyTimetablePage from 'pages/TimetablePage/ModifyTimetablePage';
import GraduationCalculatorPage from 'pages/GraduationCalculatorPage';
import PageNotFound from 'pages/Error/PageNotFound';
import PolicyPage from 'pages/PolicyPage';
import ROUTES from 'static/routes';
import LostItemWritePage from 'pages/Articles/LostItemWritePage';
import LostItemDetailPage from 'pages/Articles/LostItemDetailPage';
import LostItemChatPage from 'pages/Articles/LostItemChatPage';
import useTokenState from 'utils/hooks/state/useTokenState';
import ReportPage from 'pages/Articles/ReportPage';
import ClubEditPage from 'pages/Club/ClubEditPage';
import { useTokenStore } from 'utils/zustand/auth';
import { requestTokensFromNative, setTokensFromNative } from 'utils/ts/iosBridge';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import FindIdPage from 'pages/Auth/FindIdPage';
import FindIdEmailPage from 'pages/Auth/FindIdPage/PC/EmailPage';
import FindIdPhonePage from 'pages/Auth/FindIdPage/PC/PhonePage';
import MobileFindIdEmailPage from 'pages/Auth/FindIdPage/Mobile/EmailPage';
import MobileFindIdPhonePage from 'pages/Auth/FindIdPage/Mobile/PhonePage';
import MobileFindIdResultPage from 'pages/Auth/FindIdPage/Mobile/ResultPage';
import FindIdResultPage from 'pages/Auth/FindIdPage/PC/ResultPage';
import ProtectedLostItemChatPage from 'pages/Articles/LostItemChatPage/ProtectedLostItemChatPage';
import showToast from 'utils/ts/showToast';

interface WrapperProps {
  title: string;
  element: ReactNode;
  needAuth?: boolean;
}

function Wrapper({
  title,
  element,
  needAuth = false, // 로그인이 필요한 라우트
}: WrapperProps) {
  const { pathname } = useLocation();
  const token = useTokenState();

  useEffect(() => {
    document.title = `코인 - ${title}`;
  }, [title, pathname]);

  if (needAuth && !token) {
    return <Navigate replace to={ROUTES.Main()} />;
  }

  return (
    <>
      {element}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

function App() {
  const isMobile = useMediaQuery();

  //ios 브릿지
  useEffect(() => {
    // 앱 로드 시 토큰 요청 정의
    const initializeTokens = async () => {
      const tokens = await requestTokensFromNative();
      if (tokens.access || tokens.refresh) {
        setTokensFromNative(tokens.access, tokens.refresh);
      }
    };
    if (typeof window !== 'undefined' && window.webkit?.messageHandlers) {
      // 네이티브에서 토큰을 전달받을 함수 등록
      window.setTokens = setTokensFromNative;

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/auth')) {
        initializeTokens();
      }
    }

    return () => {
      if (typeof window !== 'undefined' && window.webkit?.messageHandlers) {
        delete window.setTokens;
      }
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path={ROUTES.Main()} element={<BoardPage />}>
          <Route index element={<Wrapper title="한기대 커뮤니티" element={<IndexPage />} />} />
          <Route path={ROUTES.PrivatePolicy()} element={<Wrapper title="개인정보 처리방침" element={<PolicyPage />} />} />

          <Route path={ROUTES.Timetable()} element={<Wrapper title="시간표" element={<TimetablePage />} />} />
          <Route path={ROUTES.TimetableRegular({ isLink: false })} element={<Wrapper title="시간표 수정" element={<ModifyTimetablePage />} />} />
          <Route path={ROUTES.TimetableDirect({ isLink: false })} element={<Wrapper title="시간표 수정" element={<ModifyTimetablePage />} />} />
          <Route path={ROUTES.GraduationCalculator()} element={<Wrapper title="졸업학점 계산기" element={<GraduationCalculatorPage />} />} />

          <Route path={ROUTES.Store()} element={<Wrapper title="상점" element={<StorePage />} />} />
          <Route path={ROUTES.BenefitStore()} element={<Wrapper title="전화 혜택" element={<StoreBenefitPage />} />} />
          <Route path={ROUTES.StoreDetail({ isLink: false })} element={<Wrapper title="상점 상세" element={<StoreDetailPage />} />} />
          <Route path={ROUTES.Review({ isLink: false })} element={<Wrapper needAuth title="상점 리뷰" element={<AddReviewPage />} />} />
          <Route path={ROUTES.ReviewEdit({ isLink: false })} element={<Wrapper needAuth title="상점 리뷰" element={<EditReviewPage />} />} />
          <Route path={ROUTES.ReviewReport({ isLink: false })} element={<Wrapper needAuth title="리뷰 신고" element={<ReviewReportingPage />} />} />
          <Route path={ROUTES.Room()} element={<Wrapper title="복덕방" element={<RoomPage />} />} />
          <Route path={ROUTES.RoomDetail({ isLink: false })} element={<Wrapper title="복덕방 상세" element={<RoomDetailPage />} />} />

          <Route path={ROUTES.BusRoute()} element={<Wrapper title="버스" element={<BusRoutePage />} />} />
          <Route path={ROUTES.BusCourse()} element={<Wrapper title="버스" element={<BusCoursePage />} />} />

          <Route path={ROUTES.Club()} element={<Wrapper title="동아리 목록" element={<ClubListPage />} />} />
          <Route path={ROUTES.ClubDetail({ isLink: false })} element={<Wrapper title="상세 소개" element={<ClubDetailPage />} />} />
          <Route path={ROUTES.ClubEdit({ isLink: false })} element={<Wrapper title="동아리 수정" element={<ClubEditPage />} />} />
          <Route path={ROUTES.NewClub()} element={<Wrapper title="동아리 생성" element={<NewClubPage />} />} />

          <Route path={ROUTES.Cafeteria()} element={<Wrapper title="식단" element={<CafeteriaPage />} />} />
          <Route path={ROUTES.Articles()} element={<Wrapper title="공지사항" element={<ArticlesPage />} />}>
            <Route index element={<ArticleListPage />} />
            <Route path={ROUTES.ArticlesDetail({ isLink: false })} element={<Wrapper title="공지사항 상세" element={<ArticlesDetailPage />} />} />
            <Route path={ROUTES.LostItemDetail({ isLink: false })} element={<Wrapper title="분실물 상세" element={<LostItemDetailPage />} />} />
            <Route path={ROUTES.LostItemRedirect()} element={<Navigate replace to={ROUTES.Articles()} />} />
            <Route path="/articles/report/:id" element={<ReportPage />} />
          </Route>
          <Route path={ROUTES.LostItemFound()} element={<Wrapper title="습득물 글쓰기" element={<LostItemWritePage />} />} />
          <Route path={ROUTES.LostItemLost()} element={<Wrapper title="분실물 글쓰기" element={<LostItemWritePage />} />} />
          <Route path={ROUTES.LostItemChat()} element={<Wrapper needAuth title="분실물 쪽지" element={<ProtectedLostItemChatPage />} />} />
          <Route path={ROUTES.CampusInfo()} element={<Wrapper title="교내 시설물 정보" element={<CampusInfo />} />} />
          {!isMobile && <Route path={ROUTES.AuthModifyInfo()} element={<Wrapper needAuth title="유저 정보변경" element={<ModifyInfoPage />} />} />}
          {!isMobile && <Route path={ROUTES.AuthSignup({ isLink: false })} element={<Wrapper title="회원가입" element={<SignupPage />} />} />}
          {!isMobile && (
            <Route path={ROUTES.AuthFindID()} element={<Wrapper title="아이디 찾기" element={<FindIdPage />} />}>
              <Route path={ROUTES.Phone()} element={<Wrapper title="아이디 찾기 - 전화번호" element={<FindIdPhonePage />} />} />
              <Route path={ROUTES.Email()} element={<Wrapper title="아이디 찾기 - 이메일" element={<FindIdEmailPage />} />} />
              <Route path={ROUTES.IDResult()} element={<Wrapper title="아이디 찾기 - 결과" element={<FindIdResultPage />} />} />
            </Route>)}
          {!isMobile && <Route path={ROUTES.AuthFindPW({ isLink: false })} element={<Wrapper title="비밀번호 찾기" element={<FindPasswordPage />} />} />}
        </Route>

        <Route path={ROUTES.Auth()} element={<AuthPage />}>
          <Route index element={<Wrapper title="로그인" element={<LoginPage />} />} />
          {isMobile && <Route path={ROUTES.AuthSignup({ isLink: false })} element={<Wrapper title="회원가입" element={<SignupPage />} />} />}
          {isMobile && <Route path={ROUTES.AuthModifyInfo()} element={<Wrapper needAuth title="유저 정보변경" element={<ModifyInfoPage />} />} />}
          {isMobile && (
            <Route path={ROUTES.AuthFindID()} element={<Wrapper title="아이디 찾기" element={<FindIdPage />} />}>
              <Route path={ROUTES.Phone()} element={<Wrapper title="아이디 찾기 - 전화번호" element={<MobileFindIdPhonePage />} />} />
              <Route path={ROUTES.Email()} element={<Wrapper title="아이디 찾기 - 이메일" element={<MobileFindIdEmailPage />} />} />
              <Route path={ROUTES.IDResult()} element={<Wrapper title="아이디 찾기 - 결과" element={<MobileFindIdResultPage />} />} />
            </Route>)}
          {isMobile && <Route path={ROUTES.AuthFindPW({ isLink: false })} element={<Wrapper title="비밀번호 찾기" element={<FindPasswordPage />} />} />}
          <Route path={ROUTES.Auth()} element={<AuthPage />}>
          </Route>
          <Route path={ROUTES.AuthModifyInfo()} element={<Wrapper needAuth title="유저 정보변경" element={<ModifyInfoPage />} />} />
        </Route>
        <Route path={ROUTES.Webview()}>
          <Route path={ROUTES.WebviewCampusInfo()} element={<Wrapper title="코인 - 교내 시설물 정보" element={<CampusInfo />} />} />
        </Route>
        <Route path={ROUTES.NotFound()} element={<Wrapper title="404 Not Found" element={<PageNotFound />} />} />
      </Routes>
      <Toast />
    </>
  );
}

export default App;
