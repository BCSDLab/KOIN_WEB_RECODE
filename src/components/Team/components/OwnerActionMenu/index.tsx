import ThreeDotsIcon from 'assets/svg/Team/three-dots.svg';
import useBooleanState from 'utils/hooks/state/useBooleanState';
import styles from './OwnerActionMenu.module.scss';

interface OwnerActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function OwnerActionMenu({ onEdit, onDelete }: OwnerActionMenuProps) {
  const [isMenuOpen, openMenu, closeMenu] = useBooleanState(false);

  const handleEdit = () => {
    closeMenu();
    onEdit();
  };

  const handleDelete = () => {
    closeMenu();
    onDelete();
  };

  return (
    <>
      <button
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

          <div className={styles.menu__dropdown} role="menu">
            <button type="button" className={styles.menu__item} role="menuitem" onClick={handleEdit}>
              편집하기
            </button>
            <button
              type="button"
              className={`${styles.menu__item} ${styles['menu__item--danger']}`}
              role="menuitem"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          </div>
        </>
      )}
    </>
  );
}
