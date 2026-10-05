import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  TWITTER_CARD_TYPE,
  buildAbsoluteUrl,
} from 'static/seo';

interface SeoProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  imageAlt?: string;
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  url,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  imageAlt,
}: SeoProps) {
  const router = useRouter();
  const resolvedTitle = title || DEFAULT_TITLE;
  const canonicalUrl = buildAbsoluteUrl(url ?? router.asPath?.split('?')[0]);

  return (
    <Head>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} key="description" />
      <link rel="canonical" href={canonicalUrl} key="canonical" />
      {noindex && <meta name="robots" content="noindex, nofollow" key="robots" />}

      <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
      <meta property="og:type" content={type} key="og:type" />
      <meta property="og:title" content={resolvedTitle} key="og:title" />
      <meta property="og:description" content={description} key="og:description" />
      <meta property="og:url" content={canonicalUrl} key="og:url" />
      <meta property="og:image" content={image} key="og:image" />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} key="og:image:alt" />}

      <meta name="twitter:card" content={TWITTER_CARD_TYPE} key="twitter:card" />
      <meta name="twitter:title" content={resolvedTitle} key="twitter:title" />
      <meta name="twitter:description" content={description} key="twitter:description" />
      <meta name="twitter:image" content={image} key="twitter:image" />
    </Head>
  );
}
