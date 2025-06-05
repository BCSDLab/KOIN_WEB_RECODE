import { useNavigate } from 'react-router-dom';
import ROUTES from 'static/routes';

function CompletePage() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate(ROUTES.Auth());
  };

  return (
    <div>
      Complete Page

      <button
        type="button"
        onClick={goToLogin}
      >
        로그인 화면으로
      </button>
    </div>
  );
}

export default CompletePage;
