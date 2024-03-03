/* eslint-disable react/require-default-props */
import { Helmet } from 'react-helmet';

type MetaHelmetProps = {
  title: string,
  description?: string,
  image?: string,
};

export default function MetaHelmet({
  title = '코인 - 한기대 커뮤니티', // 기본값을 직접 할당
  description = '보다 편하게, 한국기술교육대학교 생활에 필요한 서비스를 만날 수 있습니다.',
  image = 'https://static.koreatech.in/assets/img/facebook_showcase_image.png',
}: MetaHelmetProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:title" content={title} />
      <meta
        name="og:description"
        content={description}
      />
      <meta
        property="og:image"
        content={image}
      />
      <meta property="og:image:width" content="1200" />
    </Helmet>
  );
}
