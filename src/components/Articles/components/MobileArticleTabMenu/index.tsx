import { useRouter } from 'next/router';
import { cn } from '@bcsdlab/utils';
import { BOARD_IDS } from 'components/Articles/utils/convertArticlesTag';
import styles from './MobileArticleTabMenu.module.scss';

const TABS = [
  { label: '전체공지', boardId: BOARD_IDS.공지사항 },
  { label: '일반', boardId: BOARD_IDS.일반공지 },
  { label: '장학', boardId: BOARD_IDS.장학공지 },
  { label: '학사', boardId: BOARD_IDS.학사공지 },
  { label: '취업', boardId: BOARD_IDS.취업공지 },
  { label: '현장실습', boardId: BOARD_IDS.현장실습 },
  { label: '학생', boardId: BOARD_IDS.학생생활 },
  { label: '코인', boardId: BOARD_IDS.코인공지 },
] as const;

interface MobileArticleTabMenuProps {
  currentBoardId: number;
}

export default function MobileArticleTabMenu({ currentBoardId }: MobileArticleTabMenuProps) {
  const router = useRouter();

  const handleTabClick = (boardId: number) => {
    router.push({ pathname: router.pathname, query: { boardId, page: '1' } }, undefined, { shallow: true });
  };

  return (
    <nav className={styles.tabMenu}>
      {TABS.map((tab) => (
        <button
          key={tab.boardId}
          type="button"
          className={cn({
            [styles.tabMenu__tab]: true,
            [styles['tabMenu__tab--active']]: currentBoardId === tab.boardId,
          })}
          onClick={() => handleTabClick(tab.boardId)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
