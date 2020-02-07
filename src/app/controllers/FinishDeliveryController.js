import Delivery from '../models/Delivery';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

class FinishDeliveryController {
  async update(req, res) {
    const delivery = await Delivery.findByPk(req.deliveryId, {
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'name', 'path', 'url'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    if (!req.file) {
      return res.status(400).json({ error: 'Signature file must be attached' });
    }

    const { originalname: name, filename: path } = req.file;

    const { id: fileId } = await File.create({
      name,
      path,
    });

    delivery.signature_id = fileId;

    delivery.end_date = new Date();

    await delivery.save();

    return res.json(delivery);
  }
}

export default new FinishDeliveryController();
