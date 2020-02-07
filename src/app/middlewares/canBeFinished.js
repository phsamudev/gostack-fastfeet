import Delivery from '../models/Delivery';

export default async (req, res, next) => {
  const delivery = await Delivery.findByPk(req.deliveryId);

  if (delivery.canceled_at) {
    return res.status(400).json({ error: "Can't finish a canceled delivery" });
  }

  if (!delivery.start_date) {
    return res.status(400).json({ error: 'Delivery not started' });
  }

  if (delivery.end_date) {
    return res.status(400).json({ error: 'Delivery already finished' });
  }

  return next();
};
