import type { SamplingContext } from '@sentry/types';

const pickSampleRate = (samplingContext: Omit<SamplingContext, 'transactionContext'>): number => {
  // These go every 30 seconds or so, so create lots of transactions with no benefit.
  // Counting on cloudwatch to let us know if these start failing.
  if (samplingContext?.name === 'GET /health-checks') {
    return 0;
  }

  // Running up on transaction limit, remove preflight checks from here.
  // Count on the client to let us know if a preflight check fails.
  if (samplingContext?.request?.method?.toUpperCase() === 'OPTIONS') {
    return 0;
  }

  if (samplingContext?.sampleAll) {
    return 1;
  }

  return 0.01;
};

export default pickSampleRate;
