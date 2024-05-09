import parse from 'html-react-parser';
import styles from './EventContent.module.scss';

interface EventContentProps {
  html: string;
}
export default function EventContent({ html }: EventContentProps) {
  return <div className={styles['event-content']}>{parse(html)}</div>;
}
