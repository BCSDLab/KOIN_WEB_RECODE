export const placeTypeKeys = {
  depart: 'depart',
  arrival: 'arrival',
} as const;

export type PlaceTypeKeys = keyof typeof placeTypeKeys;

export const placeType = {
  depart: {
    title: '출발',
    placeholder: '출발지 선택',
  },
  arrival: {
    title: '도착',
    placeholder: '목적지 선택',
  },
};

export const places = ['코리아텍', '천안역', '천안터미널'];
