import { getHours, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

export default async (req, res, next) => {
  const now = new Date();

  if (getHours(now) < 8) {
    return res
      .status(400)
      .json({ error: 'Cannot start a delivery before 08:00h' });
  }

  if (getHours(now) > 17) {
    return res
      .status(400)
      .json({ error: 'Cannot start a delivery after 18:00h' });
  }

  const delivery = await Delivery.findByPk(req.deliveryId);

  if (delivery.canceled_at) {
    return res.status(400).json({ error: "Can't start a canceled delivery" });
  }

  if (delivery.start_date) {
    return res.status(400).json({ error: 'Delivery already started' });
  }

  const { count } = await Delivery.findAndCountAll({
    where: {
      deliveryman_id: delivery.deliveryman_id,
      start_date: {
        [Op.between]: [startOfDay(now), endOfDay(now)],
      },
    },
  });

  if (count > 4) {
    return res
      .status(400)
      .json({ error: 'A deliveryman can only start 5 deliveries in a day' });
  }

  return next();
};
