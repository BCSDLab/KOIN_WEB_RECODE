import type { NextPageContext } from 'next';
import Error from 'next/error';
import * as Sentry from '@sentry/nextjs';

function CustomErrorComponent({ statusCode }: { statusCode: number }) {
  return <Error statusCode={statusCode} />;
}

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
