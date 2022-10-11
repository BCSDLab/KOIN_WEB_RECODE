import React from 'react';
import AuthPage from 'pages/Auth/AuthPage';
import LoginPage from 'pages/Auth/LoginPage';
import BoardPage from 'pages/BoardPage';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { tokenState } from 'utils/recoil';
import { useRecoilState } from 'recoil';
import { getCookie } from 'utils/ts/cookie';
import Toast from 'components/common/Toast';
import SignupPage from 'pages/Auth/SignupPage';
import TimetablePage from 'pages/TimetablePage';

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
          <Route path="timetable" element={<TimetablePage />} />
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
