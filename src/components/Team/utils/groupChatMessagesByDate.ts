import type { TeamChatMessage } from 'api/team/entity';

export interface TeamChatMessageGroup {
  date: string;
  label: string;
  isToday: boolean;
  messages: TeamChatMessage[];
}

const pad = (value: number) => String(value).padStart(2, '0');

const toDateLabel = (timestamp: string) =>
  `${timestamp.slice(0, 4)}년 ${Number(timestamp.slice(5, 7))}월 ${Number(timestamp.slice(8, 10))}일`;

export default function groupChatMessagesByDate(messages: TeamChatMessage[]): TeamChatMessageGroup[] {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  return messages.reduce<TeamChatMessageGroup[]>((groups, message) => {
    const date = message.timestamp.slice(0, 10);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.date === date) {
      lastGroup.messages.push(message);
      return groups;
    }

    groups.push({
      date,
      label: toDateLabel(message.timestamp),
      isToday: date === todayKey,
      messages: [message],
    });
    return groups;
  }, []);
}
