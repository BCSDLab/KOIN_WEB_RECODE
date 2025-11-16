interface OptionCategory {
  id: number;
  name: string;
  img_url: string;
  img_code: string;
}

const OPTION_CATEGORY: OptionCategory[] = [
  {
    id: 1,
    name: '에어컨',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-airconditioner.png',
    img_code: 'opt_air_conditioner',
  },
  {
    id: 2,
    name: '냉장고',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-refrigerator.png',
    img_code: 'opt_refrigerator',
  },
  {
    id: 3,
    name: '옷장',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-closet.png',
    img_code: 'opt_closet',
  },
  {
    id: 4,
    name: 'TV',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-tv.png',
    img_code: 'opt_tv',
  },
  {
    id: 5,
    name: '전자렌지',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-microwave-range.png',
    img_code: 'opt_microwave',
  },
  {
    id: 6,
    name: '가스렌지',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-gas-stove.png',
    img_code: 'opt_gas_range',
  },
  {
    id: 7,
    name: '인덕션',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-induction-range.png',
    img_code: 'opt_induction',
  },
  {
    id: 8,
    name: '정수기',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-water-purifier.png',
    img_code: 'opt_water_purifier',
  },
  {
    id: 9,
    name: '세탁기',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-clothes-washer.png',
    img_code: 'opt_washer',
  },
  {
    id: 10,
    name: '침대',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-bed.png',
    img_code: 'opt_bed',
  },
  {
    id: 11,
    name: '책상',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-desk.png',
    img_code: 'opt_desk',
  },
  {
    id: 12,
    name: '신발장',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-shoe-rack.png',
    img_code: 'opt_shoe_closet',
  },
  {
    id: 13,
    name: '도어락',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-doorlock.png',
    img_code: 'opt_electronic_door_locks',
  },
  {
    id: 14,
    name: '비데',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-bidet.png',
    img_code: 'opt_bidet',
  },
  {
    id: 15,
    name: '베란다',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-veranda.png',
    img_code: 'opt_veranda',
  },
  {
    id: 16,
    name: '엘레베이터',
    img_url: 'https://static.koreatech.in/assets/ic-room/ic-elevator.png',
    img_code: 'opt_elevator',
  },
];

export default OPTION_CATEGORY;
