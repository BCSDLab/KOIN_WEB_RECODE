import { useEffect, useRef } from 'react';

const useOnClickOutside = <T extends HTMLElement>(onClick = () => { }) => {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (targetRef.current && !targetRef.current.contains(event.target as Node)) {
        onClick();
      }
    };

    document.addEventListener('mouseup', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [onClick]);

  return { target: targetRef };
};

export default useOnClickOutside;
