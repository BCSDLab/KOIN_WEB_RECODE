import { useEffect, useState } from 'react';

const useMount = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 클라이언트 마운트 여부를 알리는 표준 패턴, 대체 수단 없음
    setMounted(true);
  }, []);

  return mounted;
};

export default useMount;
