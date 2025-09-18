import { Dining, DiningType } from 'api/dinings/entity';
import { PLACE_ORDER } from 'static/cafeteria';

export const filterDinings = (dinings: Dining[], type: DiningType) => {
  const filteredDinings = dinings.filter((dining) => dining.type === type
    && !dining.menu.some((menuItem) => menuItem.name.includes('미운영')));

  const sortedDinings = filteredDinings.sort((a, b) => {
    const indexA = PLACE_ORDER.indexOf(a.place);
    const indexB = PLACE_ORDER.indexOf(b.place);
    return indexA - indexB;
  });

  return sortedDinings;
};
