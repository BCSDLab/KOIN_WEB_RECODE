import { useRef } from 'react';
import { cn } from '@bcsdlab/utils';

import ThreeDotsIcon from 'assets/svg/Team/three-dots.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import { useEscapeKeyDown } from 'utils/hooks/ui/useEscapeKeyDown';
import styles from './KebabMenu.module.scss';

export interface KebabMenuItem {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

interface KebabMenuProps {
  triggerAriaLabel: string;
  menuAriaLabel: string;
  items: KebabMenuItem[];
}

export default function KebabMenu({ triggerAriaLabel, menuAriaLabel, items }: KebabMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isMenuOpen, openMenu, closeMenu] = useBooleanState(false);
  useEscapeKeyDown({ onEscape: closeMenu });

  const handleItemClick = (item: KebabMenuItem) => {
    triggerRef.current?.focus();
    closeMenu();
    item.onClick();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.menu__button}
        aria-label={triggerAriaLabel}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        onClick={isMenuOpen ? closeMenu : openMenu}
      >
        <ThreeDotsIcon />
      </button>

      {isMenuOpen && (
        <>
          <button type="button" className={styles.menu__overlay} aria-label="메뉴 닫기" onClick={closeMenu} />

          <div className={styles.menu__dropdown} role="menu" aria-label={menuAriaLabel}>
            {items.map((item) => (
              <button
                key={item.key}
                type="button"
                className={cn({
                  [styles.menu__item]: true,
                  [styles['menu__item--danger']]: !!item.danger,
                })}
                role="menuitem"
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
