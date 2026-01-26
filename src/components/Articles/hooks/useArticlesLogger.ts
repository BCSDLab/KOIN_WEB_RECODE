import useLogger from 'utils/hooks/analytics/useLogger';

const CLICK_EVENTS = [
  {
    label: 'item_write',
    value: '글쓰기',
  },
  {
    label: 'find_user_write',
    value: '주인을 찾아요',
  },
  {
    label: 'lost_item_write',
    value: '잃어버렸어요',
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
    value: '', // {”분실물”, ”습득물”}
  },
  {
    label: 'find_user_delete_confirm',
    value: '확인',
  },
  {
    label: 'find_user_category',
    value: '', // {”카드”, ”신분증”, ”지갑”, ”전자제품”, ”기타”}
  },
  {
    label: 'item_post_report',
    value: '신고하기',
  },
  {
    label: 'item_post_report_confirm',
    value: '신고하기',
  },
  {
    label: 'login_prompt',
    value: '', // {"게시글 작성 팝업", "쪽지 보내기 팝업"}
  },
  {
    label: 'lost_item_filter',
    value: '분실물',
  },
  {
    label: 'lost_item_filter_apply',
    value: '분실물',
  },
  {
    label: 'lost_item_post_entry',
    value: '', // {"분실물", "습득물"}
  },
  {
    label: 'lost_item_message_login_request',
    value: '', // {"닫기", "로그인하기"}
  },
  {
    label: 'lost_item_write_login_request',
    value: '', // {"닫기", "로그인하기"}
  },
  {
    label: 'lost_item_state_change',
    value: '',
  },
  {
    label: 'lost_item_found',
    value: '',
  },
  {
    label: 'lost_item_modify',
    value: '',
  },
  {
    label: 'lost_item_modify_complete',
    value: '',
  },
] as const;

export type ClickEventLabel = (typeof CLICK_EVENTS)[number]['label'];

export type FindUserCategory = '카드' | '신분증' | '지갑' | '전자제품' | '기타';

// 추후 로깅 수정 가능성을 염두해두고 남겨둡니다.
export type ReportCategory = '주제에 맞지 않음' | '스팸' | '욕설' | '개인정보' | '기타';

export type LoginPopUpCategory = '게시글 작성 팝업' | '쪽지 보내기 팝업';

export const useArticlesLogger = () => {
  const logger = useLogger();

  const logEvent = (eventLabel: ClickEventLabel, eventValue?: string) => {
    const event = CLICK_EVENTS.find(({ label }) => label === eventLabel);
    if (event) {
      logger.actionEventClick({
        team: 'CAMPUS',
        event_label: event.label,
        value: eventValue || event.value,
      });
    }
  };

  const logItemWriteClick = () => logEvent('item_write');
  const logFindUserWriteClick = () => logEvent('find_user_write');
  const logLostItemWriteClick = () => logEvent('lost_item_write');
  const logFindUserAddItemClick = () => logEvent('find_user_add_item');
  const logLostItemAddItemClick = () => logEvent('lost_item_add_item');
  const logFindUserWriteConfirmClick = () => logEvent('find_user_write_confirm');
  const logLostItemWriteConfirmClick = () => logEvent('lost_item_write_confirm');
  const logFindUserDeleteClick = (value: '분실물' | '습득물') => logEvent('find_user_delete', value);
  const logFindUserDeleteConfirmClick = () => logEvent('find_user_delete_confirm');
  const logFindUserCategory = (category: FindUserCategory) => logEvent('find_user_category', category);
  const logLostItemCategory = (category: FindUserCategory) => logEvent('lost_item_category', category);
  const logItemPostReportClick = () => logEvent('item_post_report');
  const logItemPostReportConfirm = () => logEvent('item_post_report_confirm');
  const logLoginRequire = (category: LoginPopUpCategory) => logEvent('login_prompt', category);
  const logLostItemFilter = () => logEvent('lost_item_filter');
  const logLostItemFilterApply = () => logEvent('lost_item_filter_apply');
  const logLostItemPostEntry = (value: '분실물' | '습득물') => logEvent('lost_item_post_entry', value);
  const logLostItemMessageLoginRequest = (value: '닫기' | '로그인하기') =>
    logEvent('lost_item_message_login_request', value);
  const logLostItemWriteLoginRequest = (value: '닫기' | '로그인하기') =>
    logEvent('lost_item_write_login_request', value);
  const logLostItemStateChange = (value: '분실물' | '습득물') => logEvent('lost_item_state_change', value);
  const logLostItemFound = (value: '분실물' | '습득물') => logEvent('lost_item_found', value);
  const logLostItemModify = (value: '분실물' | '습득물') => logEvent('lost_item_modify', value);
  const logLostItemModifyComplete = (value: '분실물' | '습득물') => logEvent('lost_item_modify_complete', value);

  return {
    logItemWriteClick,
    logFindUserWriteClick,
    logLostItemWriteClick,
    logFindUserAddItemClick,
    logLostItemAddItemClick,
    logLostItemCategory,
    logFindUserWriteConfirmClick,
    logLostItemWriteConfirmClick,
    logFindUserDeleteClick,
    logFindUserDeleteConfirmClick,
    logFindUserCategory,
    logItemPostReportClick,
    logItemPostReportConfirm,
    logLoginRequire,
    logLostItemFilter,
    logLostItemFilterApply,
    logLostItemPostEntry,
    logLostItemMessageLoginRequest,
    logLostItemWriteLoginRequest,
    logLostItemStateChange,
    logLostItemFound,
    logLostItemModify,
    logLostItemModifyComplete,
  };
};
