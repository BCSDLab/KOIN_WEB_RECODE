import KebabMenu from 'components/Team/components/KebabMenu';

interface OwnerActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function OwnerActionMenu({ onEdit, onDelete }: OwnerActionMenuProps) {
  return (
    <KebabMenu
      triggerAriaLabel="모집글 메뉴"
      menuAriaLabel="모집글 메뉴"
      items={[
        { key: 'edit', label: '편집하기', onClick: onEdit },
        { key: 'delete', label: '삭제하기', onClick: onDelete, danger: true },
      ]}
    />
  );
}
