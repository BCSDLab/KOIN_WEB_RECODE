import { useParams } from 'react-router-dom';

function NoticeDetailPage() {
  const params = useParams();

  console.log(params.id);
  return (
    <div>
      공지사항 DetailPage
    </div>
  );
}

export default NoticeDetailPage;
