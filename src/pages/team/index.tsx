import { useState } from 'react';
import RecruitmentCard from 'components/Team/TeamListPage/components/RecruitmentCard';
import TeamSearchBar from 'components/Team/TeamListPage/components/TeamSearchBar';

import styles from './TeamListPage.module.scss';
const MOCK_RECRUITMENT = {
  category: '공모전',
  status: 'D-5',
  title: 'AI 아이디어 공모전 팀원 모집',
  roles: ['프론트엔드 1명', '백엔드 1명', '디자인 1명'],
  location: '온라인',
  period: '2026.07.26 ~ 2026.08.07',
  currentMemberCount: 0,
  maxMemberCount: 3,
};
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
      <RecruitmentCard
        category={MOCK_RECRUITMENT.category}
        status={MOCK_RECRUITMENT.status}
        title={MOCK_RECRUITMENT.title}
        roles={MOCK_RECRUITMENT.roles}
        location={MOCK_RECRUITMENT.location}
        period={MOCK_RECRUITMENT.period}
        currentMemberCount={MOCK_RECRUITMENT.currentMemberCount}
        maxMemberCount={MOCK_RECRUITMENT.maxMemberCount}
      />
    </main>
  );
}
