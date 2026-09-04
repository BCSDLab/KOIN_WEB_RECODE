import { useRef } from 'react';
import { cn } from '@bcsdlab/utils';

import ThreeDotsIcon from 'assets/svg/Team/three-dots.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import styles from './OwnerActionMenu.module.scss';

interface OwnerActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function OwnerActionMenu({ onEdit, onDelete }: OwnerActionMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, openMenu, closeMenu] = useBooleanState(false);
  useEscapeKeyDown({ onEscape: closeMenu });

  const handleEdit = () => {
    closeMenu();
    onEdit();
  };

  const handleDelete = () => {
    triggerRef.current?.focus();
    closeMenu();
    onDelete();
  };

  return (
    <div className={styles.menu}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.menu__button}
        aria-label="모집글 메뉴"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        onClick={isMenuOpen ? closeMenu : openMenu}
      >
        <ThreeDotsIcon />
      </button>

      {isMenuOpen && (
        <>
          <button type="button" className={styles.menu__overlay} aria-label="메뉴 닫기" onClick={closeMenu} />

          <div className={styles.menu__dropdown} role="menu" aria-label="모집글 메뉴">
            <button type="button" className={styles.menu__item} role="menuitem" onClick={handleEdit}>
              편집하기
            </button>
            <button
              type="button"
              className={cn({
                [styles.menu__item]: true,
                [styles['menu__item--danger']]: true,
              })}
              role="menuitem"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}
