import { useEffect, useRef } from 'react';

import Badge from 'components/ui/Badge';
import useLogger from 'utils/hooks/analytics/useLogger';

import styles from './ShopMenuGroups.module.scss';

// KOIN_ORDER_WEBVIEW pages/Shop/components/ShopMenuGroups 이전. 헤더 아래에 붙는 메뉴 그룹 탭
interface MenuGroup {
  id: number;
  name: string;
}

interface ShopMenuGroupsProps {
  shopName: string;
  selectedMenu: string;
  menuGroups: MenuGroup[];
  onSelect: (name: string) => void;
}

const SCROLL_OFFSET = 16;

export default function ShopMenuGroups({ shopName, selectedMenu, menuGroups, onSelect }: ShopMenuGroupsProps) {
  const logger = useLogger();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleBadgeClick = (groupName: string) => () => {
    logger.actionEventClick({
      team: 'BUSINESS',
      event_label: 'shop_detail_view',
      value: shopName,
    });
    onSelect(groupName);
  };

  useEffect(() => {
    const badgeElement = badgeRefs.current[selectedMenu];
    const container = scrollContainerRef.current;
    if (!selectedMenu || !badgeElement || !container) return;

    container.scrollTo({
      left: badgeElement.offsetLeft - SCROLL_OFFSET,
      behavior: 'smooth',
    });
  }, [selectedMenu]);

  return (
    <>
      <div className={styles.divider} />
      <div className={styles.groups} ref={scrollContainerRef}>
        {menuGroups.map((group) => (
          <button
            key={group.name}
            type="button"
            ref={(el) => {
              badgeRefs.current[group.name] = el;
            }}
            onClick={handleBadgeClick(group.name)}
            className={styles.groups__button}
          >
            <Badge
              label={group.name}
              variant="outlined"
              color={selectedMenu === group.name ? 'white' : 'neutral'}
              size="lg"
              className={styles.groups__badge}
            />
          </button>
        ))}
      </div>
    </>
  );
}
