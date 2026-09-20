export function formatChatTime(timestamp: string) {
  return timestamp.slice(11, 16);
}

export function formatChatRoomListTime(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    return `${period} ${hours % 12 || 12}:${minutes}`;
  }

  if (messageDate.getTime() === yesterday.getTime()) return '어제';

  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}월 ${day}일`;
}

// 채팅 API의 timestamp는 시간대 오프셋 없는 한국 날짜·시간입니다.
export function formatChatDate(timestamp: string) {
  return `${timestamp.slice(0, 4)}년 ${Number(timestamp.slice(5, 7))}월 ${Number(timestamp.slice(8, 10))}일`;
}
