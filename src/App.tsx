import { useEffect, ReactNode, Suspense } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
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
        <Route path="/" element={<BoardPage />}>
          <Route path="timetable" element={<HelmetWrapper title="코인 - 시간표" element={<TimetablePage />} />} />
          <Route path="/" element={<HelmetWrapper title="코인 - 한기대 커뮤니티" element={<IndexPage />} />} />
          <Route path="/store" element={<HelmetWrapper title="코인 - 상점" element={<StorePage />} />} />
          <Route path="/store/:id" element={<HelmetWrapper title="코인 - 상점 상세" element={<StoreDetailPage />} />} />
          <Route path="/bus" element={<HelmetWrapper title="코인 - 버스" element={<BusPage />} />} />
          <Route path="/cafeteria" element={<HelmetWrapper title="코인 - 식단" element={<CafeteriaPage />} />} />
          <Route path="/board/notice" element={<HelmetWrapper title="코인 - 공지사항" element={<NoticePage />} />}>
            <Route path="/board/notice/" element={<NoticeListPage />} />
            <Route path="/board/notice/:id" element={<HelmetWrapper title="코인 - 공지사항 상세" element={<NoticeDetailPage />} />} />
          </Route>
          <Route path="/room" element={<HelmetWrapper title="코인 - 복덕방" element={<RoomPage />} />} />
          <Route path="/room/:id" element={<HelmetWrapper title="코인 - 복덕방 상세" element={<RoomDetailPage />} />} />
        </Route>
        <Route path="auth" element={<PrivateRoute requireAuthentication={false} element={<AuthPage />} />}>
          <Route index element={<HelmetWrapper title="코인 - 로그인" element={<LoginPage />} />} />
          <Route path="signup" element={<HelmetWrapper title="코인 - 회원가입" element={<SignupPage />} />} />
          <Route path="findpw" element={<HelmetWrapper title="코인 - 비밀번호 찾기" element={<FindPasswordPage />} />} />
        </Route>
        <Route path="/" element={<BoardPage />}>
          <Route path="review/:id" element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 상점 리뷰" element={<AddReviewPage />} />} />} />
          <Route path="/edit/review/:id" element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 상점 리뷰" element={<EditReviewPage />} />} />} />
          <Route path="/report/review/shopid/:shopid/reviewid/:reviewid" element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 리뷰 신고" element={<ReviewReportingPage />} />} />} />

        </Route>
        <Route path="auth" element={<AuthPage />}>
          <Route path="modifyInfo" element={<PrivateRoute requireAuthentication element={<HelmetWrapper title="코인 - 유저 정보변경" element={<ModifyInfoPage />} />} />} />
        </Route>
      </Routes>
      <Toast />
    </>
  );
}

export default App;
