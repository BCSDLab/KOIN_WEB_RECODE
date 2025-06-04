import { ClubDetailResponse, NewClubData } from 'api/club/entity';

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
function categoryStringToId(label: string): number {
  const map: Record<string, number> = {
    '학술 분과': 1,
    '운동 분과': 2,
    '취미 분과': 3,
    '종교 분과': 4,
    '공연 분과': 5,
  };
  return map[label] ?? 1;
}
export function mapDetailToForm(detail: ClubDetailResponse): NewClubData {
  return {
    name: detail.name,
    image_url: detail.image_url,
    club_managers: [],
    club_category_id: categoryStringToId(detail.category),
    location: detail.location,
    description: detail.description,
    instagram: detail.instagram ?? '',
    google_form: detail.google_form ?? '',
    open_chat: detail.open_chat ?? '',
    phone_number: detail.phone_number ?? '',
    role: '',
    is_like_hidden: detail.is_liked,
  };
}
