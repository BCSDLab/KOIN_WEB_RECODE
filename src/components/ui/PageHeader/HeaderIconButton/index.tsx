import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@bcsdlab/utils';

import styles from './HeaderIconButton.module.scss';

export default function HeaderIconButton({ className, ...props }: ComponentPropsWithoutRef<'button'>) {
  return <button type="button" className={cn({ [styles.button]: true, [className ?? '']: !!className })} {...props} />;
}
