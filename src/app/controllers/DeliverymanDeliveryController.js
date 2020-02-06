import Delivery from '../models/Delivery';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliverymanDeliveryController {
  async index(req, res) {
    if (req.deliveryId) {
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
        ],
      });

      return res.json(delivery);
    }

    const deliveries = await Delivery.findAll({
      where: { deliveryman_id: req.deliverymanId },
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
