import { useLocalStorage } from 'utils/hooks/state/useLocalStorage';

const STORAGE_KEY = 'koin_articles_recent_search_keywords';
const MAX_KEYWORDS = 10;

export function useRecentSearchKeywords() {
  const [keywords, setKeywords] = useLocalStorage<string[]>(STORAGE_KEY, []);

  const addKeyword = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    const next = [trimmed, ...keywords.filter((item) => item !== trimmed)].slice(0, MAX_KEYWORDS);
    setKeywords(next);
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((item) => item !== keyword));
  };

  const clearKeywords = () => {
    setKeywords([]);
  };

  return {
    keywords,
    addKeyword,
    removeKeyword,
    clearKeywords,
  };
}
