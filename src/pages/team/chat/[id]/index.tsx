import Head from 'next/head';

export default function TeamChatPage() {
  return (
    <>
      <Head>
        <title>팀원 모집 채팅 | KOIN</title>
      </Head>

      <main>
        <h1>팀원 모집 채팅 페이지</h1>

        <input aria-label="메시지 입력" placeholder="메시지 보내기" />
        <button type="button" disabled>
          전송
        </button>
      </main>
    </>
  );
}
