'use client';

import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  container?: Element | null;
}

export default function Portal({ children, container }: PortalProps) {
  if (typeof window === 'undefined') return null;

  const target = container ?? document.body;
  return createPortal(children, target);
}
