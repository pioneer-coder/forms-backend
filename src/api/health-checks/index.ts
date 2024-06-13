import { Router } from 'express';
import { allowedMethods } from '@/middleware/index.js';
import { publicConfiguration } from '@/configuration/index.js';
import healthCheck from '@/services/healthCheck/index.js';
import endpointHandler from '../endpointHandler/index.js';
import ApiDefinitions from '../ApiDefinitions.js';

const router = Router();

router
  .route('/configuration')
  .get(endpointHandler<ApiDefinitions['/health-checks/configuration']['GET']>((_req, res) => {
    res.status(200).json(publicConfiguration);
  }))
  .all(allowedMethods('GET'));

let forcedIsHealthy = true;
router
  .route('/')
  .get(endpointHandler<ApiDefinitions['/health-checks']['GET']>(async (_req, res) => {
    const isHealthy = await healthCheck.check({ forcedIsHealthy });
    if (isHealthy) {
      res.status(200).json({ message: 'OK' });
    } else {
      res.status(400).json({ message: 'NOK' }); // intentionally not going through error handlers, let ECS tell us these failed
    }
  }))
  .all(allowedMethods('GET'));

router
  .route('/forced-healthy')
  .delete(endpointHandler<ApiDefinitions['/health-checks/forced-healthy']['DELETE']>(async (_req, res) => {
    forcedIsHealthy = false;
    res.status(200).json({ message: 'OK' });
  }))
  .post(endpointHandler<ApiDefinitions['/health-checks/forced-healthy']['POST']>(async (_req, res) => {
    forcedIsHealthy = true;
    res.status(200).json({ message: 'OK' });
  }))
  .all(allowedMethods('POST', 'DELETE'));

export default router;
