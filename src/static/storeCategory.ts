export interface IStoreCategory {
  title: string;
  state: string;
  tag: string;
  image: string;
}

const STORECATEGORY:IStoreCategory[] = [
  {
    title: '치킨',
    state: 'chicken',
    tag: 'S005',
    image: 'https://static.koreatech.in/assets/img/img-rest-chicken.png',
  },
  {
    title: '피자',
    state: 'pizza',
    tag: 'S006',
    image: 'https://static.koreatech.in/assets/img/img-rest-pizza.png',
  },
  {
    title: '도시락',
    state: 'dosirock',
    tag: 'S002',
    image: 'https://static.koreatech.in/assets/img/img-rest-box.png',
  },
  {
    title: '족발',
    state: 'jockbar',
    tag: 'S003',
    image: 'https://static.koreatech.in/assets/img/img-rest-porkfeet.png',
  },
  {
    title: '중국집',
    state: 'cafeteria',
    tag: 'S004',
    image: 'https://static.koreatech.in/assets/img/img-rest-blacknoodle.png',
  },
  {
    title: '일반음식점',
    state: 'hairshop',
    tag: 'S008',
    image: 'https://static.koreatech.in/assets/img/img-rest-normal.png',
  },
  {
    title: '카페',
    state: 'cafe',
    tag: 'S010',
    image: 'https://static.koreatech.in/assets/img/img-rest-cafe.png',
  },
  {
    title: '미용실',
    state: 'callban',
    tag: 'S009',
    image: 'https://static.koreatech.in/assets/img/img-rest-salon.png',
  },
  {
    title: '기타',
    state: 'china',
    tag: 'S001',
    image: 'https://static.koreatech.in/assets/img/img-rest-etc.png',
  },
];

export default STORECATEGORY;
