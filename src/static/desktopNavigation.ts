import { CATEGORY, type SubmenuTitle } from './category';

const submenus = CATEGORY.flatMap((category) => category.submenu);

const labels: Partial<Record<SubmenuTitle, string>> = {
  '콜밴팟 모집': '콜밴팟',
  주변상점: '주변 상점',
};

function getSubmenus(titles: SubmenuTitle[]) {
  return titles.flatMap((title) => {
    const menu = submenus.find((submenu) => submenu.title === title);

    return menu ? [{ ...menu, label: labels[title] ?? title }] : [];
  });
}

export const DESKTOP_NAVIGATION = [
  {
    title: '학교생활',
    submenu: getSubmenus(['시간표', '식단', '교내 시설물 정보', '학교 부서 정보']),
  },
  {
    title: '커뮤니티',
    submenu: getSubmenus(['공지사항', '팀원 모집', '동아리', '쪽지']),
  },
  {
    title: '교통',
    submenu: getSubmenus(['버스 교통편', '버스 시간표', '콜밴팟 모집']),
  },
  {
    title: '생활편의',
    submenu: getSubmenus(['분실물', '복덕방', '주변상점', '코인 사장님']),
  },
];
