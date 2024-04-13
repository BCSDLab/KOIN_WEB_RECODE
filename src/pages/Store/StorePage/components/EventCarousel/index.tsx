import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// eslint-disable-next-line
import 'swiper/scss';
// eslint-disable-next-line
import 'swiper/scss/autoplay'
import { ReactComponent as EmptyImageIcon } from 'assets/svg/empty-thumbnail.svg';
import { useGetAllEvents } from 'pages/Store/StorePage/components/hooks/useGetAllEvents';
import { useNavigate } from 'react-router-dom';
import styles from './EventCarousel.module.scss';

const colors = ['#6DBBDD', '#4590BB', '#175C8E', '#10477A'];

export default function EventCarousel() {
  const carousel = useGetAllEvents();
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.container}>
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={30}
          rewind
          autoplay={{
            delay: 1000000000,
          }}
          // centeredSlides
        >
          {carousel && carousel.map(((item, idx) => (
            <SwiperSlide key={item.title} className={styles.swiperSize}>
              <button
                type="button"
                className={styles['swipe-item']}
                style={{ backgroundColor: `${colors[Math.abs(((idx + 1) % 4) - 2)]}` }}
                onClick={() => navigate(`/store/${item.shop_id}`)}
              >
                {item.thumbnail_images.length > 0 ? (
                  <img
                    src={item.thumbnail_images[0]}
                    alt="가게 이미지"
                    className={styles['swipe-item__image']}
                  />
                ) : (
                  <div className={styles['swipe-item__empty-image']}>
                    <EmptyImageIcon />
                  </div>
                ) }
                <div className={styles['swipe-item__text']}>
                  <div style={{ textAlign: 'start' }}>
                    <span className={styles['swipe-item__name']}>
                      {item.title}
                    </span>
                    {' 에서'}
                  </div>
                  <div className={styles['swipe-item__nowrap']}>할인 혜택을 받아보세요!</div>
                </div>
              </button>
            </SwiperSlide>
          )))}
        </Swiper>
      </div>
    </div>
  );
}
