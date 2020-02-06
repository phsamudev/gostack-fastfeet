import Deliveryman from '../models/Deliveryman';

export default async (req, res, next) => {
  const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

  if (!deliveryman) {
    return res.status(400).json({ error: "Deliveryman doesn't exist" });
  }

  req.deliverymanId = deliveryman.id;

  return next();
};
