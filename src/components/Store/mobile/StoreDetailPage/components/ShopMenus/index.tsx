import { useEffect, useRef, type RefObject } from 'react';

import { cn } from '@bcsdlab/utils';
import EmptyThumbnailIcon from 'assets/svg/store/empty-thumbnail-icon.svg';
import SoldOutIcon from 'assets/svg/store/sold-out-icon.svg';

import styles from './ShopMenus.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/ShopMenus 이전.
// 주문 불가 상점이라 메뉴 버튼은 비활성이다. 화면에 보이는 가장 위 그룹을 탭 선택값으로 알린다
export interface MenuPrice {
  id: number;
  name: string | null;
  price: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  thumbnailImage: string;
  isSoldOut: boolean;
  prices: MenuPrice[];
}

export interface MenuGroupItems {
  menuGroupId: number;
  menuGroupName: string;
  menus: MenuItem[];
}

interface ShopMenusProps {
  menuGroupRefs: RefObject<Record<string, HTMLDivElement | null>>;
  handleChangeMenu: (name: string) => void;
  isAutoScrolling: RefObject<boolean>;
  shopMenus: MenuGroupItems[];
}

// 고정 헤더(60px)와 메뉴 그룹 탭(64px) 아래부터를 화면으로 본다
const STICKY_AREA_HEIGHT = 124;

export default function ShopMenus({ menuGroupRefs, handleChangeMenu, isAutoScrolling, shopMenus }: ShopMenusProps) {
  const visibleMap = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;

        entries.forEach((entry) => {
          const { id } = entry.target;
          const isVisible = entry.isIntersecting;

          if (visibleMap.current[id] !== isVisible) {
            visibleMap.current[id] = isVisible;
            changed = true;
          }
        });

        if (!changed || isAutoScrolling.current) return;

        const visibleEntries = Object.entries(visibleMap.current)
          .filter(([, isVisible]) => isVisible)
          .map(([id]) => menuGroupRefs.current[id])
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
                disabled
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
