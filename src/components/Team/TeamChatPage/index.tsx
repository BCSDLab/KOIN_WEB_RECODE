import styles from './TeamChatPage.module.scss';

export default function TeamChatPage() {
  return (
    <main className={styles.container}>
      <button type="button">뒤로가기</button>
      <h1>팀원 모집 채팅</h1>

      <input placeholder="메시지 보내기" />
      <button type="button">전송</button>
    </main>
  );
}
