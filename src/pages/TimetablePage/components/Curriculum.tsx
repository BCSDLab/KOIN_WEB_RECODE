/* eslint-disable no-restricted-imports */
import ErrorBoundary from 'components/common/ErrorBoundary';
import LoadingSpinner from 'components/common/LoadingSpinner';
import useDeptList from 'pages/Auth/SignupPage/hooks/useDeptList';
import React from 'react';
import useLogger from 'utils/hooks/analytics/useLogger';
import styles from '../DefaultPage/DefaultPage.module.scss';

function Curriculum() {
  const { data: deptList } = useDeptList();
  const logger = useLogger();
  return (
    <div>
      <h3 className={styles['page__title--sub']}>커리큘럼</h3>
      <ErrorBoundary fallbackClassName="loading">
        <React.Suspense fallback={<LoadingSpinner size="50" />}>
          <ul className={styles['page__curriculum-list']}>
            {deptList.map((dept) => (
              <li key={dept.name}>
                <a
                  className={styles.page__curriculum}
                  href={dept.curriculum_link}
                  onClick={() => {
                    logger.actionEventClick({
                      actionTitle: 'USER',
                      title: 'timetable',
                      value: `click_${dept.name}`,
                    });
                  }}
                  rel="noreferrer"
                >
                  {dept.name}
                </a>
              </li>
            ))}
            <li>
              <a
                className={styles.page__curriculum}
                href="https://www.koreatech.ac.kr/board.es?mid=a10103010000&bid=0002"
                onClick={() => {
                  logger.actionEventClick({
                    actionTitle: 'USER',
                    title: 'timetable',
                    value: 'click_대학요람',
                  });
                }}
                rel="noreferrer"
              >
                대학 요람
              </a>
            </li>
          </ul>
        </React.Suspense>
      </ErrorBoundary>
    </div>

  );
}

export default Curriculum;
