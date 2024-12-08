import styles from './BusLookup.module.scss';

interface BusLookupProps {
  depart: string;
  arrival: string;
}

export default function BusLookup({ depart, arrival }: BusLookupProps) {
  return (
    <div className={styles.container}>
      {depart}
      {arrival}
    </div>
  );
}
