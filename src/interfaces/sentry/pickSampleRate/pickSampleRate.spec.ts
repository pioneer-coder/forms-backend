import type { SamplingContext } from '@sentry/types';
import { expect } from 'chai';

import pickSampleRate from './index.js';

describe('interfaces/sentry/pickSampleRate', function () {
  it('should ignore health checks', function () {
    const context = {
      name: 'GET /health-checks',
    };
    expect(pickSampleRate(context)).to.equal(0);
  });

  it('should ignore OPTIONS requests', function () {
    const context = {
      name: 'OPTIONS /some/path',
      request: {
        method: 'OPTIONS',
      },
    };
    expect(pickSampleRate(context)).to.equal(0);
  });

  it('should return 1% for anything else', function () {
    const context = {} as SamplingContext;
    expect(pickSampleRate(context)).to.equal(0.01);
  });

  it('should return 100% if sampleAll is set to true', function () {
    const context = { sampleAll: true } as unknown as SamplingContext;
    expect(pickSampleRate(context)).to.equal(1);
  });
});
