import { useParams } from 'react-router-dom';

function StoreDetailPage() {
  const params = useParams();
  console.log(params);
  return (
    <div>StoreDetail</div>
  );
}

export default StoreDetailPage;
