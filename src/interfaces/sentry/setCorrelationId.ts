import * as Sentry from '@sentry/node';

const setCorrelationId = (cid: string | null | undefined): void => {
  if (cid) {
    Sentry.setTag('correlationId', cid);
  } else {
    Sentry.setTag('correlationId', null);
  }
};

export default setCorrelationId;
