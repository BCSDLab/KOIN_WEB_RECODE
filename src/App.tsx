import AuthPage from 'pages/Auth';
import LoginPage from 'pages/Auth/LoginPage';
import BoardPage from 'pages/BoardPage';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BoardPage />} />
      <Route path="login/*" element={<AuthPage />}>
        <Route index element={<LoginPage />} />
      </Route>
    </Routes>
  );
}

export default App;
