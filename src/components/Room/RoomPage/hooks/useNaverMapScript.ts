import { useEffect, useState } from 'react';

const NAVER_MAP_SCRIPT_ID = 'naver-map-script';

export default function useNaverMapScript() {
  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!window.naver?.maps;
  });

  useEffect(() => {
    if (isLoaded) return;

    const existingScript = document.getElementById(NAVER_MAP_SCRIPT_ID);
    if (existingScript) {
      const handleLoad = () => setIsLoaded(true);
      existingScript.addEventListener('load', handleLoad);
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.id = NAVER_MAP_SCRIPT_ID;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}`;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);
  }, [isLoaded]);

  return isLoaded;
}
