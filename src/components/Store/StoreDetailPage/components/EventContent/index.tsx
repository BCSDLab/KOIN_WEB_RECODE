import parse from 'html-react-parser';
import { sanitizeHtml } from 'utils/ts/sanitize';
import styles from './EventContent.module.scss';

interface EventContentProps {
  html: string;
}
export default function EventContent({ html }: EventContentProps) {
  return <div className={styles['event-content']}>{parse(sanitizeHtml(html))}</div>;
}
