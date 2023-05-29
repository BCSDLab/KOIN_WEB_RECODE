import { useRecoilValueLoadable } from 'recoil';
import { tokenStateQuery } from 'utils/recoil';
import { setCookie } from 'utils/ts/cookie';

const useTokenState = () => {
  const token = useRecoilValueLoadable(tokenStateQuery);
  if (token.state === 'hasValue' && token.contents) {
    setCookie('AUTH_TOKEN_KEY', token.contents, 3);
    return token.contents;
  }
  return '';
};

export default useTokenState;
