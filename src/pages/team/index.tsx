import { useState } from 'react';
import Head from 'next/head';

import RecruitmentCard from 'components/Team/components/RecruitmentCard';
import TeamSearchBar from 'components/Team/components/TeamSearchBar';

import styles from './TeamListPage.module.scss';

const MOCK_RECRUITMENTS = [
  {
    id: 1,
    category: '공모전',
    status: 'D-5',
    title: 'AI 아이디어 공모전 팀원 모집',
    roles: ['프론트엔드 1명', '백엔드 1명', '디자인 1명'],
    location: '온라인',
    period: '2026.08.27 ~ 2026.09.01',
    currentMemberCount: 0,
    maxMemberCount: 3,
  },
  {
    id: 2,
    category: '대외활동',
    status: 'D-13',
    title: '2026 대외활동 팀원 모집',
    roles: [],
    location: '온 · 오프라인',
    period: '2026.08.27 ~ 2026.09.09',
    currentMemberCount: 2,
    maxMemberCount: 3,
  },
];

export default function TeamListPage() {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = () => {
    setSearchKeyword(searchTitle.trim());
  };

  const filteredRecruitments = MOCK_RECRUITMENTS.filter((recruitment) =>
    recruitment.title.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  return (
    <>
      <Head>
        <title>팀원 모집 | KOIN</title>
        <meta name="description" content="한국기술교육대학교 팀원 모집 게시글을 확인하고 검색할 수 있습니다." />
      </Head>

      <main>
        <h1>팀원 모집</h1>

        <TeamSearchBar value={searchTitle} onChange={setSearchTitle} onSearch={handleSearch} />

        <p>전체({filteredRecruitments.length})</p>

        {filteredRecruitments.map((recruitment) => (
          <RecruitmentCard
            key={recruitment.id}
            category={recruitment.category}
            status={recruitment.status}
            title={recruitment.title}
            roles={recruitment.roles}
            location={recruitment.location}
            period={recruitment.period}
            currentMemberCount={recruitment.currentMemberCount}
            maxMemberCount={recruitment.maxMemberCount}
          />
        ))}

        <button type="button" className={styles.recruitButton}>
          모집하기
        </button>
      </main>
    </>
  );
}
