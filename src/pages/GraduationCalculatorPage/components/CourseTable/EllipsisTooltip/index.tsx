import {
  useState, useRef, useEffect, ReactNode,
} from 'react';
import styles from './EllipsisTooltip.module.scss';

interface EllipsisTooltipProps {
  text: string | ReactNode;
  children?: React.ReactNode;
}

// ReactNode -> string 변환 함수
const extractText = (node: ReactNode): string => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    return extractText(node.props.children);
  }
  return '';
};

function EllipsisTooltip({ text, children }: EllipsisTooltipProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isEllipsisApplied, setIsEllipsisApplied] = useState(false);

  // 가상 요소 생성 후 부모 요소의 스타일 영향을 받지 않도록 처리 후 텍스트 너비 비교
  useEffect(() => {
    if (textRef.current) {
      const element = textRef.current;

      const hiddenElement = document.createElement('div');
      hiddenElement.style.whiteSpace = 'nowrap';
      hiddenElement.style.maxWidth = `${element.offsetWidth}px`;
      hiddenElement.style.font = window.getComputedStyle(element).font;
      hiddenElement.textContent = extractText(text);

      document.body.appendChild(hiddenElement);
      const originalWidth = hiddenElement.scrollWidth;
      document.body.removeChild(hiddenElement);

      const isEllipsis = originalWidth > element.offsetWidth;
      setIsEllipsisApplied(isEllipsis);
    }
  }, [text]);

  const handleMouseEnter = () => {
    setTooltipVisible(isEllipsisApplied);
  };

  return (
    <div
      className={styles.ellipsisContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <div ref={textRef} className={styles.ellipsisText}>
        {children}
      </div>
      {isTooltipVisible && (
        <div className={styles.tooltip}>{extractText(text)}</div>
      )}
    </div>
  );
}

export default EllipsisTooltip;
