import * as Yup from 'yup';

import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: {
        delivery_id: req.deliveryId,
      },
      attributes: ['id', 'delivery_id', 'description'],
    });

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string()
        .min(1)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: req.deliveryId,
      },
    });

    if (!delivery.start_date) {
      return res.status(400).json({
        error:
          "Can't register a problem for a delivery that hasn't been started",
      });
    }

    if (delivery.end_date) {
      return res.status(400).json({
        error: "Can't register a problem for a finished delivery",
      });
    }

    if (delivery.canceled_at) {
      return res.status(400).json({
        error: "Can't register a problem for a canceled delivery",
      });
    }

    const { description } = req.body;

    const { id } = await DeliveryProblem.create({
      delivery_id: req.deliveryId,
      description,
    });

    return res.json({
      id,
      delivery_id: req.deliveryId,
      description,
    });
  }
}

export default new DeliveryProblemController();
