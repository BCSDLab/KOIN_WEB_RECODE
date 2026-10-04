import ROUTES from 'static/routes';

// 리디자인 전 페이지만 경로로 헤더 스타일을 정한다. 항목을 추가하지 말 것.
// 새 페이지는 `Page.mobileHeader`를 선언하고, 그렇게 옮긴 페이지는 여기서 지운다.
export function getLegacyRoute(pathname: string) {
  const isClub = pathname.startsWith(ROUTES.Club());

  return {
    isMain: pathname === ROUTES.Main(),
    isClub,
    isLight:
      isClub ||
      pathname.startsWith(ROUTES.Articles()) ||
      pathname.startsWith(ROUTES.LostItems()) ||
      pathname.startsWith(ROUTES.Cafeteria()),
    isBusTimetable: [ROUTES.BusCourseShuttle(), ROUTES.BusCourseExpress(), ROUTES.BusCourseCity()].some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    ),
    isTimetable: [ROUTES.Timetable(), ROUTES.TimetableList()].includes(pathname),
  };
}

export type LegacyRoute = ReturnType<typeof getLegacyRoute>;
