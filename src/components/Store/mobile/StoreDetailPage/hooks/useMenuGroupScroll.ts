import { useCallback, useEffect, useRef, useState } from 'react';

// KOIN_ORDER_WEBVIEW pages/Shop/hooks/useMenuGroupScroll 이전.
// 메뉴 그룹 탭을 누르면 해당 그룹으로 부드럽게 스크롤하고, 스크롤이 끝날 때까지 관찰자에 의한 선택 변경을 막는다
export default function useMenuGroupScroll() {
  const [selectedMenu, setSelectedMenu] = useState('');
  const menuGroupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isAutoScrolling = useRef<boolean>(false);

  const handleScrollTo = (name: string) => {
    const element = menuGroupRefs.current[name];
    if (element) {
      isAutoScrolling.current = true;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedMenu(name);
    }
  };

  const handleChangeMenu = useCallback((name: string) => {
    setSelectedMenu(name);
  }, []);

  useEffect(() => {
    const handleScrollEnd = () => {
      if (isAutoScrolling.current) {
        isAutoScrolling.current = false;
      }
    };

    window.addEventListener('scrollend', handleScrollEnd);

    return () => {
      window.removeEventListener('scrollend', handleScrollEnd);
    };
  }, []);

  return {
    selectedMenu,
    menuGroupRefs,
    isAutoScrolling,
    handleScrollTo,
    handleChangeMenu,
  };
}
