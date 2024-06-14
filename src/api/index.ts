import { Router } from 'express';

import questionnairesRouter from './questionnaires/index.js';
import healthChecksRouter from './health-checks/index.js';
import forDevelopersRouter from './for-developers/index.js';

const router = Router();

router.use('/questionnaires', questionnairesRouter);
router.use('/health-checks', healthChecksRouter);
router.use('/for-developers', forDevelopersRouter);

export default router;
