/* eslint-disable no-restricted-imports */
import { IDept } from 'api/dept/entity';
import useDeptList from '../hooks/useDeptList';
import styles from './DefaultPage.module.scss';

function Curriculum() {
  const { data: deptList } = useDeptList();
  return (
    <ul className={styles['page__curriculum-list']}>
      {(deptList as unknown as Array<IDept> | undefined ?? []).map((dept) => (
        <li key={dept.name}>
          <a
            className={styles.page__curriculum}
            href={dept.curriculum_link}
          >
            {dept.name}
          </a>
        </li>
      ))}
      <li>
        <a
          className={styles.page__curriculum}
          href="https://www.koreatech.ac.kr/board.es?mid=a10103010000&bid=0002"
        >
          대학 요람
        </a>
      </li>
    </ul>
  );
}

export default Curriculum;
