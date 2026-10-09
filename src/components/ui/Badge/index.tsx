import type { HTMLAttributes, ReactElement, SVGProps } from 'react';

import { cn } from '@bcsdlab/utils';

import styles from './Badge.module.scss';

// 모바일 상점·주문 화면용 알약 모양 라벨 (KOIN_ORDER_WEBVIEW의 Badge와 같은 모양)
interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined';
  color?: 'primary' | 'primaryLight' | 'neutral' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  font?: 'sm' | 'xs';
  label?: string;
  startIcon?: ReactElement<SVGProps<SVGSVGElement>>;
  endIcon?: ReactElement<SVGProps<SVGSVGElement>>;
}

export default function Badge({
  variant = 'default',
  color = 'primary',
  size = 'lg',
  font = 'sm',
  label,
  startIcon,
  endIcon,
  className,
  ...rest
}: BadgeProps) {
  return (
    <div
      className={cn({
        [styles.badge]: true,
        [styles[`badge--${size}`]]: true,
        [styles[`badge--font-${font}`]]: true,
        [styles[`badge--${color}-${variant}`]]: true,
        [className ?? '']: !!className,
      })}
      {...rest}
    >
      {startIcon && <span className={styles['badge__start-icon']}>{startIcon}</span>}
      {label && <span>{label}</span>}
      {endIcon && <span className={styles['badge__end-icon']}>{endIcon}</span>}
    </div>
  );
}
