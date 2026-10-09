import type { CSSProperties } from 'react';

import type { ShopInfoSummaryResponse } from 'api/storeMobile/entity';
import Portal from 'components/Portal';
import { Navigation, Pagination, Zoom } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.css';
import styles from './ImageViewer.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/ImageViewer 이전.
// 오라클과 같은 Swiper(Zoom·Navigation·Pagination) 구성과 CSS 변수로 전체 화면 뷰어를 body 포털에 띄운다
interface ImageViewerProps {
  images: ShopInfoSummaryResponse['images'];
  onClose: () => void;
  initialIndex?: number;
}

type CSSWithCustomProperties = CSSProperties & Record<`--${string}`, string>;

const SWIPER_STYLES: CSSWithCustomProperties = {
  '--swiper-navigation-color': '#fff',
  '--swiper-pagination-color': '#fff',
  '--swiper-pagination-bottom': '30px',
};

export default function ImageViewer({ images, onClose, initialIndex = 0 }: ImageViewerProps) {
  return (
    <Portal>
      <div className={styles.viewer}>
        <button type="button" className={styles.viewer__close} onClick={onClose}>
          ✕
        </button>

        <Swiper
          zoom
          navigation
          pagination={{ clickable: true }}
          modules={[Zoom, Navigation, Pagination]}
          style={SWIPER_STYLES}
          className={styles.viewer__swiper}
          initialSlide={initialIndex}
        >
          {images.map((image) => (
            <SwiperSlide key={image.image_url}>
              <div className="swiper-zoom-container">
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- 오라클과 같이 원본 이미지를 Swiper 확대 컨테이너에 그대로 넣는다 */}
                <img src={image.image_url} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Portal>
  );
}
