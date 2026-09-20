import { formatChatDate } from 'utils/ts/chatTime';
import type { TeamChatMessage } from 'api/team/entity';

export interface TeamChatMessageGroup {
  date: string;
  label: string;
  messages: TeamChatMessage[];
}


export default function groupChatMessagesByDate(messages: TeamChatMessage[]): TeamChatMessageGroup[] {
  return messages.reduce<TeamChatMessageGroup[]>((groups, message) => {
    const date = message.timestamp.slice(0, 10);
    const lastGroup = groups[groups.length - 1];

    if (lastGroup?.date === date) {
      lastGroup.messages.push(message);
      return groups;
    }

    groups.push({
      date,
      label: formatChatDate(message.timestamp),
      messages: [message],
    });
    return groups;
  }, []);
}
