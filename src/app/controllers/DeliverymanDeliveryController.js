import { Op } from 'sequelize';

import Delivery from '../models/Delivery';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliverymanDeliveryController {
  async index(req, res) {
    const where = {
      deliveryman_id: req.deliverymanId,
      canceled_at: null,
    };

    if (req.query.delivered === 'true') {
      where.end_date = { [Op.ne]: null };
    } else {
      where.end_date = null;
    }

    if (req.deliveryId) {
      where.id = req.deliveryId;

      const delivery = await Delivery.findOne({
        where,
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
        ],
      });

      if (!delivery) {
        return res
          .status(404)
          .json({ error: 'Delivery not found for this deliveryman' });
      }

      return res.json(delivery);
    }

    const deliveries = await Delivery.findAll({
      order: [['created_at', 'DESC']],
      where,
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
      ],
    });

    return res.json(deliveries);
  }
}

export default new DeliverymanDeliveryController();
