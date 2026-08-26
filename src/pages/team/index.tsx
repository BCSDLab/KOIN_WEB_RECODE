import { useState } from 'react';

import TeamSearchBar from 'components/Team/TeamListPage/components/TeamSearchBar';

import styles from './TeamListPage.module.scss';

export default function TeamListPage() {
  // 검색창에 현재 입력 중인 값
  const [searchTitle, setSearchTitle] = useState('');

  // 검색 버튼이나 Enter를 눌렀을 때 실행
  const handleSearch = () => {
    console.log('검색어:', searchTitle);
  };

  return (
    <main className={styles.container}>
      <TeamSearchBar value={searchTitle} onChange={setSearchTitle} onSearch={handleSearch} />

      <p>전체(20)</p>
    </main>
  );
}
