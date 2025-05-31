import { useSearchParams } from 'react-router-dom';
import styles from './ResultPage.module.scss';

function ResultPage() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  return (
    <div className={styles.container}>
      <h1>Result Page</h1>
      <p>
        당신의 아이디는
        <strong>{userId}</strong>
        {' '}
        입니다.
      </p>
    </div>
  );
}

export default ResultPage;
