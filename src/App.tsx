import AuthPage from 'pages/Auth';
import LoginPage from 'pages/Auth/LoginPage';
import BoardPage from 'pages/BoardPage';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { getCookie } from 'utils/ts/cookie';

function App() {
  const token = getCookie('AUTH_TOKEN_KEY');
  return (
    <Routes>
      <Route path="/" element={<BoardPage />} />
      <Route path="/auth/*" element={token ? <Navigate replace to="/" /> : <AuthPage />}>
        <Route index element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
