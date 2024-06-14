import * as Sentry from '@sentry/node';

const setClientVersion = (clientVersion: string | null | undefined): void => {
  if (clientVersion) {
    Sentry.setTag('clientVersion', clientVersion);
  } else {
    Sentry.setTag('clientVersion', null);
  }
};

export default setClientVersion;
