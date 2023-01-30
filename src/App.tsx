import React from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { tokenState } from 'utils/recoil';
import { useRecoilState } from 'recoil';
import { getCookie } from 'utils/ts/cookie';
import AuthPage from 'pages/Auth/AuthPage';
import LoginPage from 'pages/Auth/LoginPage';
import BoardPage from 'pages/BoardPage';
import StorePage from 'pages/BoardPage/Store/StorePage';
import NoticePage from 'pages/BoardPage/Notice/NoticePage';
import Toast from 'components/common/Toast';
import SignupPage from 'pages/Auth/SignupPage';
import StoreDetailPage from 'pages/BoardPage/Store/StoreDetailPage';
import BusPage from 'pages/BusPage';
import IndexPage from 'pages/IndexPage';

const useTokenState = () => {
  const [token, setToken] = useRecoilState(tokenState);
  React.useEffect(() => {
    const cookieToken = getCookie('AUTH_TOKEN_KEY');
    if (cookieToken) {
      setToken(String(cookieToken));
    }
  });
  return token;
};

function App() {
  const token = useTokenState();
  return (
    <>
      <Routes>
        <Route path="/" element={<BoardPage />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/:id" element={<StoreDetailPage />} />
          <Route path="/bus" element={<BusPage />} />
          <Route path="/board/notice" element={<NoticePage />} />
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
