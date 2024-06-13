import sentry from '@/interfaces/sentry/index.js';
import { logWithCid } from '@/utils/logger/index.js';

type Fn = () => void | Promise<void>
class AfterCommit {
  private actions: Array<Fn>;

  constructor() {
    this.actions = [];
  }

  add(fn: Fn): void {
    this.actions.push(fn);
  }

  async commit(): Promise<void> {
    const log = logWithCid();

    await Promise.all(
      this.actions.map(async (fn) => {
        try {
          await fn();
        } catch (error) {
          log.error(error, 'after commit hook failed');
          sentry.captureException(error);
        }
      }),
    );
  }
}

export default AfterCommit;
