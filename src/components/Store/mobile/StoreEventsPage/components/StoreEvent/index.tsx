import { useId, useState, type ReactNode } from 'react';

import { cn } from '@bcsdlab/utils';
import type { Events } from 'api/storeMobile/entity';
import CollapsedEvent from 'components/Store/mobile/StoreEventsPage/components/CollapsedEvent';
import ExpandedEvent from 'components/Store/mobile/StoreEventsPage/components/ExpandedEvent';

import styles from './StoreEvent.module.scss';

interface AnimatedSlotProps {
  id?: string;
  isVisible: boolean;
  offsetDirection: 'up' | 'down';
  children: ReactNode;
}

function AnimatedSlot({ id, isVisible, offsetDirection, children }: AnimatedSlotProps) {
  return (
    <div
      id={id}
      aria-hidden={!isVisible}
      className={cn({
        [styles.slot]: true,
        [styles['slot--visible']]: isVisible,
        [styles['slot--hidden-up']]: !isVisible && offsetDirection === 'up',
        [styles['slot--hidden-down']]: !isVisible && offsetDirection === 'down',
      })}
    >
      <div className={styles.slot__inner}>{children}</div>
    </div>
  );
}

interface StoreEventProps {
  event: Events;
}

export default function StoreEvent({ event }: StoreEventProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <article className={styles.event}>
      <AnimatedSlot isVisible={!isOpen} offsetDirection="up">
        <CollapsedEvent event={event} onToggleOpen={toggleIsOpen} contentId={contentId} isOpen={isOpen} />
      </AnimatedSlot>
      <AnimatedSlot id={contentId} isVisible={isOpen} offsetDirection="down">
        <ExpandedEvent event={event} onToggleOpen={toggleIsOpen} contentId={contentId} isOpen={isOpen} />
      </AnimatedSlot>
    </article>
  );
}
