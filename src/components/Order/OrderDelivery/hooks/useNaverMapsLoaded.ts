import { useEffect, useState } from 'react';

// order(index.html)처럼 지오코더 서브모듈을 포함해 네이버 지도 스크립트를 불러온다.
// Room의 useNaverMapScript는 지오코더 없이 불러와 naver.maps.Service가 없으므로 별도 스크립트로 둔다.
// maps.js는 동적으로 붙이면 서브모듈(maps-geocoder.js)을 비동기로 받는다. 그래서 maps.js의 load 시점엔
// naver.maps.Service가 아직 없고, 서브모듈까지 받은 뒤 naver.maps.onJSContentLoaded가 불린다. 그때를 준비 완료로 본다.
// 로드 여부는 지도·지오코딩 효과에만 쓰고 렌더 결과에는 쓰지 않는다(서버·클라이언트 첫 렌더 동일)
const NAVER_MAP_GEOCODER_SCRIPT_ID = 'naver-map-geocoder-script';

interface NaverMapsLoader {
  Service?: unknown;
  onJSContentLoaded?: (() => void) | null;
}

const getMapsLoader = () => window.naver?.maps as unknown as NaverMapsLoader | undefined;

const isGeocoderReady = () => typeof window !== 'undefined' && !!getMapsLoader()?.Service;

// maps.js 본체가 실행된 뒤 서브모듈 로드 완료를 기다린다. 다른 구독자가 있어도 함께 불리도록 이어 붙인다
const waitForSubmodules = (onReady: () => void) => {
  const loader = getMapsLoader();
  if (!loader) return;
  if (loader.Service) {
    onReady();

    return;
  }

  const previous = loader.onJSContentLoaded;
  loader.onJSContentLoaded = () => {
    previous?.();
    onReady();
  };
};

export default function useNaverMapsLoaded() {
  const [isLoaded, setIsLoaded] = useState(isGeocoderReady);

  useEffect(() => {
    if (isLoaded) return undefined;

    let isActive = true;
    const markReady = () => {
      if (isActive) setIsLoaded(true);
    };
    const handleLoad = () => waitForSubmodules(markReady);

    let script = document.getElementById(NAVER_MAP_GEOCODER_SCRIPT_ID) as HTMLScriptElement | null;
    if (script) {
      // 다른 곳에서 이미 붙인 스크립트: 본체가 실행됐으면 서브모듈만 기다리고, 아니면 load를 기다린다
      if (getMapsLoader()) waitForSubmodules(markReady);
      else script.addEventListener('load', handleLoad);
    } else {
      script = document.createElement('script');
      script.id = NAVER_MAP_GEOCODER_SCRIPT_ID;
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}&submodules=geocoder`;
      script.async = true;
      script.addEventListener('load', handleLoad);
      document.head.appendChild(script);
    }

    const target = script;

    return () => {
      isActive = false;
      target.removeEventListener('load', handleLoad);
    };
  }, [isLoaded]);

  return isLoaded;
}
