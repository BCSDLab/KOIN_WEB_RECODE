import { useEffect, useMemo, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import type { UnorderableShopMenusResponse } from 'api/storeMobile/entity';
import { storeMobileQueries } from 'api/storeMobile/queries';
import { setStartLoggingTime } from 'components/Store/mobile/common/utils/loggingTime';
import useScrollLogging from 'components/Store/mobile/StoreListPage/hooks/useScrollLogging';
import useLogger from 'utils/hooks/analytics/useLogger';
import useScrollToTop from 'utils/hooks/ui/useScrollToTop';
import { isomorphicSessionStorage } from 'utils/ts/env';

import DetailHeader from './components/DetailHeader';
import ImageCarousel from './components/ImageCarousel';
import ShopMenuGroups from './components/ShopMenuGroups';
import ShopMenus, { type MenuGroupItems } from './components/ShopMenus';
import ShopSummary from './components/ShopSummary';
import useMenuGroupScroll from './hooks/useMenuGroupScroll';
import styles from './StoreDetailPage.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/UnorderableShopView 이전 (주문 불가 상점 상세)
interface StoreDetailPageProps {
  id: string;
}

// order useGetUnorderableShopMenus의 select: 옵션 가격이 있으면 옵션별 가격, 없으면 단일 가격 하나
function toMenuGroups(data: UnorderableShopMenusResponse): MenuGroupItems[] {
  return data.menu_categories.map((category) => ({
    menuGroupId: category.id,
    menuGroupName: category.name,
    menus: category.menus.map((menu) => {
      const hasOptions = menu.option_prices && menu.option_prices.length > 0;

      return {
        id: menu.id,
        name: menu.name,
        description: menu.description ?? '',
        thumbnailImage: menu.image_urls?.[0] || '',
        isSoldOut: menu.is_hidden,
        prices: hasOptions
          ? menu.option_prices.map((option, index) => ({ id: index, name: option.option ?? null, price: option.price }))
          : [{ id: 0, name: null, price: menu.single_price }],
      };
    }),
  }));
}

export default function StoreDetailPage({ id }: StoreDetailPageProps) {
  // React Compiler가 아래 스크롤 로깅 함수를 메모이즈하면 오라클과 달리 구독이 렌더마다 다시 걸리지 않는다
  'use no memo';

  useScrollToTop();
  const logger = useLogger();
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { selectedMenu, menuGroupRefs, isAutoScrolling, handleScrollTo, handleChangeMenu } = useMenuGroupScroll();

  const { data: shopInfoSummary } = useSuspenseQuery(storeMobileQueries.summary(id));
  const { data: shopInfo } = useSuspenseQuery(storeMobileQueries.detail(id));
  const { data: shopMenusResponse } = useSuspenseQuery(storeMobileQueries.menus(id));

  const shopMenus = useMemo(() => toMenuGroups(shopMenusResponse), [shopMenusResponse]);
  const menuGroups = useMemo(
    () => shopInfo.menu_categories.map((category) => ({ id: category.id, name: category.name })),
    [shopInfo.menu_categories],
  );

  // 오라클과 같이 매 렌더 새 함수를 넘겨 스크롤 로깅 구독이 렌더마다 다시 걸리게 한다(useCallback·컴파일러 메모이즈 금지).
  // 재구독 때 기준 스크롤 위치가 현재 위치로 갱신되므로, 메뉴 그룹 탭을 눌러 이동한 직후의 스크롤은 기록되지 않는다
  const shopDetailScrollLogging = () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view',
      value: shopInfoSummary.name,
      event_category: 'scroll',
    });
  };

  useScrollLogging(shopDetailScrollLogging);

  useEffect(() => {
    setStartLoggingTime('enteredShopDetail');
    isomorphicSessionStorage.setItem('enteredShopName', shopInfoSummary.name);
  }, [shopInfoSummary.name]);

  return (
    <div className={styles.page}>
      <DetailHeader name={shopInfoSummary.name} targetRef={targetRef} />
      <ImageCarousel images={shopInfoSummary.images} targetRef={targetRef} shopName={shopInfoSummary.name} />
      <ShopSummary id={id} shopInfoSummary={shopInfoSummary} shopInfo={shopInfo} />
      <ShopMenuGroups
        shopName={shopInfoSummary.name}
        selectedMenu={selectedMenu}
        onSelect={handleScrollTo}
        menuGroups={menuGroups}
      />
      <ShopMenus
        menuGroupRefs={menuGroupRefs}
        handleChangeMenu={handleChangeMenu}
        isAutoScrolling={isAutoScrolling}
        shopMenus={shopMenus}
      />
    </div>
  );
}
