import { Navigate } from 'react-router-dom';
import ROUTES from 'static/routes';
import { useUser } from 'utils/hooks/state/useUser';
import { isStudentUser } from 'utils/ts/userTypeGuards';
import LostItemChatPage from '.';

export default function ProtectedLostItemChatPage() {
  const { data: userInfo } = useUser();

  if (!userInfo || !isStudentUser(userInfo)) {
    return <Navigate to={ROUTES.NotFound()} replace />;
  }

  return <LostItemChatPage userInfo={userInfo} />;
}
