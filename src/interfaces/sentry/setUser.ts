import * as Sentry from '@sentry/node';

const setUser = (user: { id: string; isOnBehalfOf: boolean } | null | undefined): void => {
  if (user) {
    Sentry.setTag('isOnBehalfOf', user.isOnBehalfOf);
    Sentry.setUser({ id: user.id });
  } else {
    Sentry.setUser(null);
  }
};

export default setUser;
