import { Router } from 'express';
import {
  ForbiddenError,
  MissingRequiredFieldsError,
  NotFoundError,
  ServerError,
  UnauthorizedError,
} from '@/errors/index.js';
import allowedMethods from '@/middleware/allowedMethods.js';
import { noodleApiKey } from '@/middleware/index.js';
import { cidLocalStorage } from '@/utils/correlationId/index.js';
import sentry from '@/interfaces/sentry/index.js';

const router = Router();

router
  .route('/test-errors/not-found')
  .get((_req, _res, next) => {
    next(new NotFoundError('grrr'));
  })
  .all(allowedMethods('GET'));

router
  .route('/test-errors/missing-required')
  .post((_req, _res, next) => {
    next(new MissingRequiredFieldsError('arg1', 'arg2'));
  })
  .all(allowedMethods('GET'));

router
  .route('/missing-required/:key/in-the-middle')
  .post((req, _res, next) => {
    next(new MissingRequiredFieldsError(req.params.key));
  })
  .all(allowedMethods('GET'));

router
  .route('/test-errors/raw-error')
  .get((_req, _res, next) => {
    next(new Error('Ooooppppsss'));
  })
  .all(allowedMethods('GET'));

router
  .route('/test-errors/method-not-allowed')
  .delete((_req, _res, next) => {
    next(new ServerError('nothing to delete'));
  })
  .all(allowedMethods('DELETE'));

router
  .route('/test-errors/unauthorized')
  .get((_req, _res, next) => {
    next(new UnauthorizedError('Nope, I do not know who you are'));
  })
  .all(allowedMethods('GET'));

router
  .route('/test-errors/internal-error')
  .get((_req, res, _next) => {
    sentry.captureException(new Error('Something bad happened internally'));
    res.status(200).json({ message: 'OK' });
  })
  .all(allowedMethods('GET'));

router
  .route('/test-errors/forbidden')
  .get((_req, _res, next) => {
    next(new ForbiddenError('Nope, I know who you are, but you are not allowed to do this'));
  })
  .all(allowedMethods('GET'));

router
  .route('/test-errors/no-response')
  .get((_req, _res, _next) => {
    // intentionally no responding to mimic long run time request and generate a 504.
  })
  .all(allowedMethods('GET'));

router
  .route('/test-errors/:code')
  .get(
    noodleApiKey('catchall-noodle-key'),
    (req, res) => {
      const statusCode = parseInt(req.params.code, 10);
      if (typeof statusCode === 'number') {
        res.status(statusCode).json({
          correlationId: req.cid,
          message: 'Test error',
          statusCode,
          type: 'TestError',
        });
      } else {
        res.status(400).json({
          correlationId: req.cid,
          details: { param: req.params.code },
          message: 'Code not a number',
          statusCode,
          type: 'TestError',
        });
      }
    },
  )
  .all(allowedMethods('GET'));

router
  .route('/request-headers')
  .get((req, res, _next) => {
    req.log.info({ headers: req.headers, rawHeaders: req.rawHeaders }, 'request-headers');
    res.status(200).json({ headers: req.headers, rawHeaders: req.rawHeaders });
  })
  .all(allowedMethods('GET'));

router
  .route('/my-ip')
  .get((req, res, _next) => {
    req.log.info({ ip: req.ip, ips: req.ips }, 'request-ips');
    res.status(200).json({ ip: req.ip, ips: req.ips });
  })
  .all(allowedMethods('GET'));

router
  .route('/test-cid-in-async-local-storage')
  .get((req, res, _next) => {
    const id = cidLocalStorage.getStore();
    req.log.info(`\n\n\nreq.cid: ${req.cid}\nALS: ${id}\n\n\n`);
    res.status(200).json({ cid: req.cid, message: 'OK' });
  })
  .all(allowedMethods('GET'));

export default router;
