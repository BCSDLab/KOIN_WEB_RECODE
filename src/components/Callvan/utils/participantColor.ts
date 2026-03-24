const PARTICIPANT_COLORS = [
  '#DDB1FE',
  '#D39AFE',
  '#CE86FD',
  '#C969FC',
  '#C358FC',
  '#B611F5',
  '#980AC9',
  '#7D08A4',
] as const;

export type ParticipantColor = (typeof PARTICIPANT_COLORS)[number];

/**
 * 참여자 목록 내 순서(colorIndex)를 기준으로 색상을 반환합니다.
 * userId가 아닌 목록 내 인덱스를 사용해야 같은 목록 안에서 색상 중복을 방지할 수 있습니다.
 * is_me인 참여자는 filled 아이콘을 사용하므로 이 함수를 호출하지 않습니다.
 */
export function getParticipantColor(colorIndex: number): ParticipantColor {
  return PARTICIPANT_COLORS[colorIndex % PARTICIPANT_COLORS.length];
}
