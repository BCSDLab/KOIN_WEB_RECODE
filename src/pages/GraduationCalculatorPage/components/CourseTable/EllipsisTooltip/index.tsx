import { ReactNode } from 'react';
import { useEllipsisTooltip } from 'utils/hooks/ui/useEllipsisTooltip';
import styles from './EllipsisTooltip.module.scss';

interface EllipsisTooltipProps {
  text: string | ReactNode;
  children?: ReactNode;
}

const extractText = (node: ReactNode): string => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    return extractText(node.props.children);
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
