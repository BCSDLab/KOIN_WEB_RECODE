import { useState } from 'react';

import BlockIcon from 'assets/svg/Articles/block.svg';
import KebabIcon from 'assets/svg/Articles/kebab.svg';
import { useOutsideClick } from 'utils/hooks/ui/useOutsideClick';

import styles from './ChatHeaderMenu.module.scss';

interface ChatHeaderMenuProps {
  onBlockClick: () => void;
}

export default function ChatHeaderMenu({ onBlockClick }: ChatHeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { containerRef } = useOutsideClick<HTMLDivElement>({ onOutsideClick: () => setIsOpen(false) });

  const handleBlockClick = () => {
    setIsOpen(false);
    onBlockClick();
  };

  return (
    <div className={styles['header-menu']} ref={containerRef}>
      <button type="button" className={styles['header-menu__trigger']} aria-label="더보기" onClick={() => setIsOpen((prev) => !prev)}>
        <KebabIcon />
      </button>
      {isOpen && (
        <div className={styles['header-menu__dropdown']}>
          <button type="button" className={styles['header-menu__option']} onClick={handleBlockClick}>
            <BlockIcon />
            차단하기
          </button>
        </div>
      )}
    </div>
  );
}
