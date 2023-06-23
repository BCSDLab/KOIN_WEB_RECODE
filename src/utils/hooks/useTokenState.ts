import { useRecoilValueLoadable } from 'recoil';
import { tokenState } from 'utils/recoil';

const useTokenState = () => {
  const token = useRecoilValueLoadable(tokenState);
  if (token.state === 'hasValue' && token.contents) {
    return token.contents;
  }
  return '';
};

export default useTokenState;
