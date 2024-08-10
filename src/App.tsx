/* eslint-disable max-len */
import { useEffect, ReactNode, Suspense } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import ROUTES from 'static/routes';
import AuthPage from 'pages/Auth/AuthPage';
import LoginPage from 'pages/Auth/LoginPage';
import BoardPage from 'pages/BoardPage';
import StorePage from 'pages/Store/StorePage';
import NoticePage from 'pages/Notice/NoticePage';
import NoticeListPage from 'pages/Notice/NoticeListPage';
import NoticeDetailPage from 'pages/Notice/NoticeDetailPage';
import Toast from 'components/common/Toast';
import LogPage from 'components/common/LogPage';
import SignupPage from 'pages/Auth/SignupPage';
import FindPasswordPage from 'pages/Auth/FindPasswordPage';
import StoreDetailPage from 'pages/Store/StoreDetailPage';
import BusPage from 'pages/BusPage';
import IndexPage from 'pages/IndexPage';
import RoomPage from 'pages/Room/RoomPage';
import RoomDetailPage from 'pages/Room/RoomDetailPage';
import TimetablePage from 'pages/TimetablePage';
import CafeteriaPage from 'pages/Cafeteria';
import MetaHelmet from 'components/common/MetaHelmet';
import ModifyInfoPage from 'pages/Auth/ModifyInfoPage';
import PrivateRoute from 'components/common/PrivateRoute';
import AddReviewPage from 'pages/StoreReviewPage/AddReviewPage';
import EditReviewPage from 'pages/StoreReviewPage/EditReviewPage';
import ReviewReportingPage from 'pages/Store/StoreDetailPage/Review/components/ReviewReporting';

interface HelmetWrapperProps {
  title: string;
  element: ReactNode;
}

function HelmetWrapper({ title, element }: HelmetWrapperProps) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
  }, [title, location]);

  return (
    <>
      <MetaHelmet title={title} />
      {element}
      <Suspense fallback={null}>
        <LogPage />
      </Suspense>
    </>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path={ROUTES.MAIN} element={<BoardPage />}>
          <Route path={ROUTES.TIMETABLE} element={<HelmetWrapper title="코인 - 시간표" element={<TimetablePage />} />} />
          <Route path={ROUTES.MAIN} element={<HelmetWrapper title="코인 - 한기대 커뮤니티" element={<IndexPage />} />} />
          <Route path={ROUTES.STORE} element={<HelmetWrapper title="코인 - 상점" element={<StorePage />} />} />
          <Route path={ROUTES.STORE_DETAIL} element={<HelmetWrapper title="코인 - 상점 상세" element={<StoreDetailPage />} />} />
          <Route path={ROUTES.BUS} element={<HelmetWrapper title="코인 - 버스" element={<BusPage />} />} />
          <Route path={ROUTES.CAAFETERIA} element={<HelmetWrapper title="코인 - 식단" element={<CafeteriaPage />} />} />
          <Route path={ROUTES.BOARD_NOTICE} element={<HelmetWrapper title="코인 - 공지사항" element={<NoticePage />} />}>
            <Route path={ROUTES.BOARD_NOTICE} element={<NoticeListPage />} />
            <Route path={ROUTES.BOARD_NOTICE_DETAIL} element={<HelmetWrapper title="코인 - 공지사항 상세" element={<NoticeDetailPage />} />} />
          </Route>
          <Route path={ROUTES.ROOM} element={<HelmetWrapper title="코인 - 복덕방" element={<RoomPage />} />} />
          <Route path={ROUTES.ROOM_DETAIL} element={<HelmetWrapper title="코인 - 복덕방 상세" element={<RoomDetailPage />} />} />
        </Route>
        <Route path={ROUTES.AUTH} element={<PrivateRoute requireAuthentication={false} element={<AuthPage />} />}>
          <Route index element={<HelmetWrapper title="코인 - 로그인" element={<LoginPage />} />} />
          <Route path={ROUTES.AUTH_SIGNUP} element={<HelmetWrapper title="코인 - 회원가입" element={<SignupPage />} />} />
          <Route path={ROUTES.AUTH_FINDPW} element={<HelmetWrapper title="코인 - 비밀번호 찾기" element={<FindPasswordPage />} />} />
        </Route>
        <Route path={ROUTES.MAIN} element={<BoardPage />}>
          <Route path={ROUTES.REVIEW} element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 상점 리뷰" element={<AddReviewPage />} />} />} />
          <Route path={ROUTES.REVIEW_EDIT} element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 상점 리뷰" element={<EditReviewPage />} />} />} />
          <Route path={ROUTES.REVIEW_REPORT} element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 리뷰 신고" element={<ReviewReportingPage />} />} />} />

        </Route>
        <Route path={ROUTES.AUTH} element={<AuthPage />}>
          <Route path={ROUTES.AUTH_MODIFYINFO} element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 유저 정보변경" element={<ModifyInfoPage />} />} />} />
        </Route>
      </Routes>
      <Toast />
    </>
  );
}

export default App;
