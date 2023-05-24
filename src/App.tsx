import React from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import AuthPage from 'pages/Auth/AuthPage';
import LoginPage from 'pages/Auth/LoginPage';
import BoardPage from 'pages/BoardPage';
import StorePage from 'pages/Store/StorePage';
import NoticePage from 'pages/Notice/NoticePage';
import NoticeListPage from 'pages/Notice/NoticeListPage';
import NoticeDetailPage from 'pages/Notice/NoticeDetailPage';
import Toast from 'components/common/Toast';
import SignupPage from 'pages/Auth/SignupPage';
import StoreDetailPage from 'pages/Store/StoreDetailPage';
import BusPage from 'pages/BusPage';
import IndexPage from 'pages/IndexPage';
import RoomPage from 'pages/Room/RoomPage';
import TimetablePage from 'pages/TimetablePage';
import { tokenState } from 'utils/recoil';

const useTokenState = () => useRecoilValue(tokenState);

function App() {
  const token = useTokenState();
  return (
    <>
      <Routes>
        <Route path="/" element={<BoardPage />}>
          <Route path="timetable" element={<TimetablePage />} />
          <Route path="/" element={<IndexPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/:id" element={<StoreDetailPage />} />
          <Route path="/bus" element={<BusPage />} />
          <Route path="/board/notice" element={<NoticePage />}>
            <Route path="/board/notice/" element={<NoticeListPage />} />
            <Route path="/board/notice/:id" element={<NoticeDetailPage />} />
          </Route>
          <Route path="/room" element={<RoomPage />} />
        </Route>
        <Route path="auth" element={token ? <Navigate replace to="/" /> : <AuthPage />}>
          <Route index element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>
      </Routes>
      <Toast />
    </>

  );
}

export default App;
