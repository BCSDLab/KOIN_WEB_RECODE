import useLogger from 'utils/hooks/analytics/useLogger';

const CLICK_EVENTS = [
  {
    label: 'item_write',
    value: '글쓰기',
  },
  {
    label: 'find_user_add_item',
    value: '물품 추가',
  },
  {
    label: 'lost_item_add_item',
    value: '물품 추가',
  },
  {
    label: 'lost_item_category', // 11-9. 분실물신고_품목선택_클릭
    value: '', // {”카드”, ”신분증”, ”지갑”, ”전자제품”, ”기타”}
  },
  {
    label: 'find_user_write_confirm',
    value: '작성완료',
  },
  {
    label: 'lost_item_write_confirm',
    value: '작성완료',
  },
  {
    label: 'find_user_delete',
    value: '삭제',
  },
  {
    label: 'find_user_delete_confirm',
    value: '확인',
  },
  {
    label: 'find_user_category',
    value: '', // {”카드”, ”신분증”, ”지갑”, ”전자제품”, ”기타”}
  },
] as const;

export type ClickEventLabel = typeof CLICK_EVENTS[number]['label'];

export type FindUserCategory = '카드' | '신분증' | '지갑' | '전자제품' | '기타';

export const useArticlesLogger = () => {
  const logger = useLogger();

  const logEvent = (eventLabel: ClickEventLabel, eventValue?: string) => {
    const event = CLICK_EVENTS.find(({ label }) => label === eventLabel);
    if (event) {
      logger.actionEventClick({
        actionTitle: 'CAMPUS',
        event_label: event.label,
        value: eventValue || event.value,
        event_category: 'click',
      });
    }
  };

  const logItemWriteClick = () => logEvent('item_write');
  const logFindUserAddItemClick = () => logEvent('find_user_add_item');
  const logLostItemAddItemClick = () => logEvent('lost_item_add_item');
  const logFindUserWriteConfirmClick = () => logEvent('find_user_write_confirm');
  const logLostItemWriteConfirmClick = () => logEvent('lost_item_write_confirm');
  const logFindUserDeleteClick = () => logEvent('find_user_delete');
  const logFindUserDeleteConfirmClick = () => logEvent('find_user_delete_confirm');
  const logFindUserCategory = (category: FindUserCategory) => logEvent('find_user_category', category);
  const logLostItemCategory = (category: FindUserCategory) => logEvent('lost_item_category', category);

  return {
    logItemWriteClick,
    logFindUserAddItemClick,
    logLostItemAddItemClick,
    logLostItemCategory,
    logFindUserWriteConfirmClick,
    logLostItemWriteConfirmClick,
    logFindUserDeleteClick,
    logFindUserDeleteConfirmClick,
    logFindUserCategory,
  };
};
