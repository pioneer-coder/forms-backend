import { Router } from 'express';

import casesRouter from './questionnaire/index.js';
import healthChecksRouter from './health-checks/index.js';
import forDevelopersRouter from './for-developers/index.js';

const router = Router();

router.use('/cases', casesRouter);
router.use('/health-checks', healthChecksRouter);
router.use('/for-developers', forDevelopersRouter);

export default router;
