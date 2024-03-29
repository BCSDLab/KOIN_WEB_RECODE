import { useQuery } from 'react-query';
import LoadingSpinner from 'components/common/LoadingSpinner';
import * as api from 'api';
import HotPost from 'components/Post/HotPost';
import { HotPostResponse } from 'api/notice/entity';
import { APIError } from 'interfaces/APIError';

function useHotArticleList() {
  const { data: hotArticleList, isSuccess } = useQuery<HotPostResponse[] & APIError>(
    'hotArticleList',
    api.notice.HotPostList,
    { retry: 0 },
  );

  if (!isSuccess) return <LoadingSpinner size="80px" />;

  return <HotPost hotArticleList={hotArticleList} />;
}

export default useHotArticleList;
