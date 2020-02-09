import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class ProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await DeliveryProblem.findAll({
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'delivery_id', 'description'],
      include: [
        {
          model: Delivery,
          as: 'delivery',
          where: { canceled_at: null },
          attributes: ['id', 'recipient_id', 'deliveryman_id', 'product'],
          include: [
            {
              model: Recipient,
              as: 'recipient',
              attributes: ['id', 'name'],
            },
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    return res.json(problems);
  }

  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.problemId);

    const delivery = await Delivery.findByPk(problem.delivery_id, {
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

    if (!delivery) {
      return res.status(400).json({ error: "Delivery doesn't exist" });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({ error: 'Delivery already canceled' });
    }

    if (delivery.end_date) {
      return res
        .status(400)
        .json({ error: "Can't cancel a finished delivery" });
    }

    delivery.canceled_at = new Date();

    await delivery.save();

    await Queue.add(CancellationMail.key, {
      delivery,
      problem,
    });

    return res.status(200).json(delivery);
  }
}

export default new ProblemController();
