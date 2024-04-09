// import { useParams } from 'react-router-dom';
import { StoreEvent } from 'api/store/entity';
import EventCard from './components';
// import useStoreMenus from './hooks/useStoreEventList';
import styles from './EventTable.module.scss';

export default function EventTable() {
  // const params = useParams();
  // const { storeEventList } = useStoreMenus(params.id!);
  const testList = {
    events: [
      {
        title: '대박 할인! 모든 상품 50% OFF',
        content: '이번 주말만! 모든 상품을 반값에 제공합니다. 지금 바로 최고의 딜을 놓치지 마세요!',
        thumbnail_image: 'https://marketplace.canva.com/EAFvpxry27Y/2/0/1600w/canva-%EB%B6%84%ED%99%8D-%ED%8C%8C%EB%9E%91-%ED%8F%AC%ED%86%A0-%EC%9D%B8%EC%A6%9D-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%9D%B8%EC%8A%A4%ED%83%80%EA%B7%B8%EB%9E%A8-%EA%B2%8C%EC%8B%9C%EB%AC%BC-9YfoHCV2VnQ.jpg',
        updated_at: '2024.01.01',
      },
      {
        title: '신메뉴 출시 기념 이벤트',
        content: '새롭게 출시한 메뉴를 첫 주문하시는 모든 고객님께 특별 사은품을 드립니다. 맛있는 신메뉴와 함께 즐거운 식사 시간을 가지세요!',
        thumbnail_image: '',
        updated_at: '2024.01.01',
      },
      {
        title: '마감 임박! 재고 정리 대방출',
        content: '시즌 마감 상품을 정리합니다! 재고가 소진될 때까지 최고 70% 할인을 제공하니, 이 기회를 놓치지 마세요!',
        thumbnail_image: '',
        updated_at: '2024.01.01',
      },
    ],
  };

  return (
    <div className={styles.eventContainer}>
      {testList && testList.events.map((event: StoreEvent) => (
        <EventCard key={event.title} event={event} />
      ))}
    </div>
  );
}
