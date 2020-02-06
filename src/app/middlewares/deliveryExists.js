import Delivery from '../models/Delivery';

export default async (req, res, next) => {
  const delivery = await Delivery.findByPk(req.params.deliveryId);

  if (!delivery) {
    return res.status(400).json({ error: "Delivery doesn't exist" });
  }

  req.deliveryId = delivery.id;

  return next();
};
