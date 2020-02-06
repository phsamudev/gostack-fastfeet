import Recipient from '../models/Recipient';

export default async (req, res, next) => {
  const recipient = await Recipient.findByPk(req.params.recipientId);

  if (!recipient) {
    return res.status(400).json({ error: "Recipient doesn't exist" });
  }

  req.recipientId = recipient.id;

  return next();
};
