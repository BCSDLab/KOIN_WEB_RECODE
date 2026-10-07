import type { ButtonHTMLAttributes, ReactElement, ReactNode, SVGProps } from 'react';

import { cn } from '@bcsdlab/utils';

import styles from './Button.module.scss';

// 모바일 상점·주문 화면용 버튼 (KOIN_ORDER_WEBVIEW의 Button과 같은 모양)
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'neutral' | 'gray' | 'white' | 'darkGray';
  size?: 'sm' | 'md' | 'lg';
  startIcon?: ReactElement<SVGProps<SVGSVGElement>>;
  endIcon?: ReactElement<SVGProps<SVGSVGElement>>;
  children?: ReactNode;
  state?: 'default' | 'disabled';
  fullWidth?: boolean;
}

export default function Button({
  color = 'primary',
  size = 'md',
  startIcon,
  endIcon,
  children,
  state = 'default',
  fullWidth = false,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = state === 'disabled';

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn({
        [styles.button]: true,
        [styles[`button--${size}`]]: true,
        [styles['button--full-width']]: fullWidth,
        [styles['button--disabled']]: isDisabled,
        [styles[`button--${color}`]]: !isDisabled,
        [className ?? '']: !!className,
      })}
      {...rest}
    >
      {startIcon && <span className={styles['button__start-icon']}>{startIcon}</span>}
      {children}
      {endIcon && <span className={styles['button__end-icon']}>{endIcon}</span>}
    </button>
  );
}
