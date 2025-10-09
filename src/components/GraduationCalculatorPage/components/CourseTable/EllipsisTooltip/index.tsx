import { ReactNode, ReactElement } from 'react';
import { useEllipsisTooltip } from 'utils/hooks/ui/useEllipsisTooltip';
import styles from './EllipsisTooltip.module.scss';

interface EllipsisTooltipProps {
  text: string | ReactNode;
  children?: ReactNode;
}

const extractText = (node: ReactNode): string => {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node !== null) {
    if ('props' in node && typeof node.props === 'object' && node.props !== null) {
      const element = node as ReactElement<{ children?: ReactNode }>;
      if ('children' in element.props) {
        return extractText(element.props.children);
      }
    }
  }
  return '';
};

function EllipsisTooltip({ text, children }: EllipsisTooltipProps) {
  const {
    textRef,
    isTooltipVisible,
    handleMouseEnter,
    handleMouseLeave,
  } = useEllipsisTooltip(extractText(text));

  return (
    <div
      className={styles.ellipsisContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={textRef} className={styles.ellipsisText}>
        {children}
      </div>
      {isTooltipVisible && <div className={styles.tooltip}>{extractText(text)}</div>}
    </div>
  );
}

export default EllipsisTooltip;
