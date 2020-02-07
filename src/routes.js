import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import AvatarFileController from './app/controllers/AvatarFileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanDeliveryController from './app/controllers/DeliverymanDeliveryController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import FinishDeliveryController from './app/controllers/FinishDeliveryController';

import authMiddleware from './app/middlewares/auth';
import deliverymanExists from './app/middlewares/deliverymanExists';
import deliveryExists from './app/middlewares/deliveryExists';
import recipientExists from './app/middlewares/recipientExists';
import canBeFinished from './app/middlewares/canBeFinished';
import canBeStarted from './app/middlewares/canBeStarted';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

/**
 * Deliveries by a deliveryman
 */
routes.get(
  '/deliverymen/:deliverymanId/deliveries',
  deliverymanExists,
  DeliverymanDeliveryController.index
);
routes.get(
  '/deliverymen/:deliverymanId/deliveries/:deliveryId',
  deliverymanExists,
  deliveryExists,
  DeliverymanDeliveryController.index
);

/**
 * Start a delivery
 */
routes.put(
  '/deliveries/:deliveryId/start',
  deliveryExists,
  canBeStarted,
  StartDeliveryController.update
);

/**
 * Finish a delivery
 */
routes.put(
  '/deliveries/:deliveryId/finish',
  deliveryExists,
  canBeFinished,
  upload.single('file'),
  FinishDeliveryController.update
);

/**
 * Admin authorization required
 */
routes.use(authMiddleware);

/**
 * Recipients
 */
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put(
  '/recipients/:recipientId',
  recipientExists,
  RecipientController.update
);

/**
 * Deliverymen
 */
routes.get('/deliverymen', DeliverymanController.index);
routes.get(
  '/deliverymen/:deliverymanId',
  deliverymanExists,
  DeliverymanController.index
);
routes.put(
  '/deliverymen/:deliverymanId',
  deliverymanExists,
  DeliverymanController.update
);
routes.delete(
  '/deliverymen/:deliverymanId',
  deliverymanExists,
  DeliverymanController.delete
);
routes.post('/deliverymen', DeliverymanController.store);

/**
 * Deliverymen avatar
 */
routes.post(
  '/deliverymen/:deliverymanId/files',
  deliverymanExists,
  upload.single('file'),
  AvatarFileController.store
);

/**
 * Deliveries
 */
routes.post('/deliveries', DeliveryController.store);
routes.get('/deliveries', DeliveryController.index);
routes.get('/deliveries/:deliveryId', deliveryExists, DeliveryController.index);
routes.delete(
  '/deliveries/:deliveryId',
  deliveryExists,
  DeliveryController.delete
);

export default routes;
