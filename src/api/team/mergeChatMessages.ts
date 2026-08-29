import type { TeamChatMessage } from './entity';

export default function mergeChatMessages(...messageLists: TeamChatMessage[][]) {
  const messageMap = new Map<number, TeamChatMessage>();

  messageLists.flat().forEach((message) => messageMap.set(message.message_id, message));

  return [...messageMap.values()].sort((a, b) => a.message_id - b.message_id);
}
