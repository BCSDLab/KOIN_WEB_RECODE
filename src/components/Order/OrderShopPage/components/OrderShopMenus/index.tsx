import { useEffect, useRef, type RefObject } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import EmptyThumbnailIcon from 'assets/svg/Store/empty-thumbnail-icon.svg';
import SoldOutIcon from 'assets/svg/Store/sold-out-icon.svg';
import type { MenuGroupItems } from 'components/Store/mobile/StoreDetailPage/components/ShopMenus';
import ROUTES from 'static/routes';

import styles from 'components/Store/mobile/StoreDetailPage/components/ShopMenus/ShopMenus.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/ShopMenus 이전 (주문 가능 상점 분기, isOrderable=true).
// 모양은 주문 불가 상점 상세(A4)와 같아 스타일을 그대로 쓴다. 품절이 아닌 메뉴를 누르면 메뉴 상세로 이동한다.
// 화면에 보이는 가장 위 그룹을 탭 선택값으로 알린다
interface OrderShopMenusProps {
  id: string;
  menuGroupRefs: RefObject<Record<string, HTMLDivElement | null>>;
  handleChangeMenu: (name: string) => void;
  isAutoScrolling: RefObject<boolean>;
  shopMenus: MenuGroupItems[];
}

// 고정 헤더(60px)와 메뉴 그룹 탭(64px) 아래부터를 화면으로 본다
const STICKY_AREA_HEIGHT = 124;

export default function OrderShopMenus({
  id,
  menuGroupRefs,
  handleChangeMenu,
  isAutoScrolling,
  shopMenus,
}: OrderShopMenusProps) {
  const router = useRouter();
  const visibleMap = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;

        entries.forEach((entry) => {
          const groupId = entry.target.id;
          const isVisible = entry.isIntersecting;

          if (visibleMap.current[groupId] !== isVisible) {
            visibleMap.current[groupId] = isVisible;
            changed = true;
          }
        });

        if (!changed || isAutoScrolling.current) return;

        const visibleEntries = Object.entries(visibleMap.current)
          .filter(([, isVisible]) => isVisible)
          .map(([groupId]) => menuGroupRefs.current[groupId])
          .filter((el): el is HTMLDivElement => !!el)
          .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

        if (visibleEntries.length > 0) {
          handleChangeMenu(visibleEntries[0].id);
        }
      },
      {
        threshold: 0,
        rootMargin: `-${STICKY_AREA_HEIGHT}px 0px 0px 0px`,
      },
    );

    Object.values(menuGroupRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [menuGroupRefs, handleChangeMenu, isAutoScrolling]);

  return (
    <div className={styles.menus}>
      {shopMenus.map((group) => (
        <div
          key={group.menuGroupId}
          className={styles.group}
          ref={(el) => {
            menuGroupRefs.current[group.menuGroupName] = el;
          }}
          id={group.menuGroupName}
        >
          <span className={styles.group__title}>{group.menuGroupName}</span>
          <div className={styles.group__card}>
            {group.menus.map((menu, index) => (
              <button
                type="button"
                className={cn({
                  [styles.menu]: true,
                  [styles['menu--divided']]: index !== 0,
                })}
                key={menu.id}
                name={menu.name}
                disabled={menu.isSoldOut}
                onClick={() => router.push(ROUTES.OrderShopMenu({ id, menuId: String(menu.id) }))}
              >
                <div className={styles.menu__info}>
                  <span className={styles.menu__name}>{menu.name}</span>
                  {menu.description && <span className={styles.menu__description}>{menu.description}</span>}
                  {menu.prices.map((price) => {
                    if (!price.name) {
                      return (
                        <span key={price.id} className={styles.menu__price}>
                          {price.price.toLocaleString()}
                          원
                        </span>
                      );
                    }

                    return (
                      <div key={price.id} className={styles.option}>
                        <span className={styles.option__name}>
                          {price.name}
                          {' '}
                          :
                        </span>

                        <span className={styles.option__price}>
                          {price.price.toLocaleString()}
                          원
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.menu__thumbnail}>
                  {menu.isSoldOut && (
                    <div className={styles['menu__sold-out']}>
                      <SoldOutIcon className={styles.icon} />
                      <span className={styles['menu__sold-out-text']}>품절</span>
                    </div>
                  )}
                  {!menu.thumbnailImage && (
                    <div className={styles.menu__empty}>
                      <EmptyThumbnailIcon className={styles.icon} />
                    </div>
                  )}
                  {menu.thumbnailImage && (
                    // eslint-disable-next-line @next/next/no-img-element -- 오라클과 같은 원본 이미지 주소를 그대로 쓴다(next/image 최적화 경로를 거치지 않음)
                    <img src={menu.thumbnailImage} alt={menu.name} className={styles.menu__image} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
