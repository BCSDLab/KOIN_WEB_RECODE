import { useEffect, useSyncExternalStore } from 'react';

const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);

  return () => window.removeEventListener('hashchange', onChange);
};
const getHashId = () => decodeURIComponent(window.location.hash.replace('#', ''));
const getServerHashId = () => '';

/**
 * URL 해시(`#배달금액` 등)가 가리키는 섹션 id를 돌려주고, 마운트 때 그 섹션으로 스크롤한다. 해시가 없으면 맨 위로 올린다.
 * 해시는 서버가 모르므로 서버·하이드레이션 렌더에서는 항상 빈 문자열이고 마운트 후 실제 값으로 바뀐다.
 */
export default function useHashSection() {
  const hashId = useSyncExternalStore(subscribeHash, getHashId, getServerHashId);

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);

      return undefined;
    }

    const target = document.getElementById(getHashId());
    if (!target) return undefined;

    const timer = window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);

    return () => window.clearTimeout(timer);
  }, []);

  return hashId;
}
