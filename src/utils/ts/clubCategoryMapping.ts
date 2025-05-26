const clubCategoryMap: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '학술 분과',
  2: '운동 분과',
  3: '취미 분과',
  4: '종교 분과',
  5: '공연 분과',
};

export function getClubCategoryName(id: number): string {
  return clubCategoryMap[id as 1 | 2 | 3 | 4 | 5] ?? '잘 못된 분과 ID입니다';
}
