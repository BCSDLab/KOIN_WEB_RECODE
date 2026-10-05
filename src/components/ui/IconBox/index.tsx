import type { ReactNode } from 'react';
import styles from './IconBox.module.scss';

interface IconBoxProps {
  children?: ReactNode;
  className?: string;
}

function IconBox({ children, className }: IconBoxProps) {
  return (
    <span className={`${styles['icon-box']} ${className ?? ''}`}>
      {children}
    </span>
  );
}

export default IconBox;
