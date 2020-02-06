import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import AvatarFileController from './app/controllers/AvatarFileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliverymanDeliveryController from './app/controllers/DeliverymanDeliveryController';
// import DeliverymanDeliveredController from './app/controllers/DeliverymanDeliveredController';

import authMiddleware from './app/middlewares/auth';
import deliverymanExists from './app/middlewares/deliverymanExists';
import deliveryExists from './app/middlewares/deliveryExists';
import recipientExists from './app/middlewares/recipientExists';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

/**
 * Deliveries not delivered by a deliveryman
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
 * Deliveries delived by a deliveryman
 */
// routes.get(
//   '/deliverymen/:id/delivered',
//   deliverymanExists,
//   DeliverymanDeliveredController
// );

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
