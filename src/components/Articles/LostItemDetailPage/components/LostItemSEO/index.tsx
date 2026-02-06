import Head from 'next/head';
import { SingleLostItemArticleResponseDTO } from 'api/articles/entity';

interface LostItemSEOProps {
  article: SingleLostItemArticleResponseDTO;
}

const DEFAULT_IMAGE = 'https://static.koreatech.in/assets/img/facebook_showcase_image.png';

export default function LostItemSEO({ article }: LostItemSEOProps) {
  const { type, category, found_place, content, images } = article;

  const typeLabel = type === 'FOUND' ? '[습득물]' : '[분실물]';
  const title = `${typeLabel} ${category} - ${found_place} | KOIN 분실물`;
  const description = content || `${found_place}에서 ${type === 'FOUND' ? '습득' : '분실'}한 ${category}입니다.`;
  const image = images?.[0]?.image_url || DEFAULT_IMAGE;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
