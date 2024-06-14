import * as Sentry from '@sentry/node';

const setupExpressErrorHandler: typeof Sentry.setupExpressErrorHandler = (app) => {
  app.use(
    Sentry.expressErrorHandler({
      shouldHandleError: () => true, // handle in ignoreError called by beforeSend.
    }),
  );
};

export default setupExpressErrorHandler;
