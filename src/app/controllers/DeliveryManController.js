import * as Yup from 'yup';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string()
        .min(1)
        .required(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (deliverymanExists) {
      return res.status(400).json({ error: 'Delivery man already exists' });
    }

    const { id, name, email, avatar_id } = await Deliveryman.create(req.body);

    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    if (page < 1) {
      return res.status(401).json({ error: 'Invalid page number' });
    }

    if (req.deliverymanId) {
      const deliveryman = await Deliveryman.findByPk(req.deliverymanId, {
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'name', 'path', 'url'],
          },
        ],
      });

      return res.json(deliveryman);
    }

    const deliverymen = await Deliveryman.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    return res.json(deliverymen);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().min(1),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: "Deliveryman doesn't exist" });
    }

    const { email } = req.body;

    if (email && deliveryman.email !== email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email },
      });

      if (deliverymanExists) {
        return res.status(400).json({ error: 'Email already being used' });
      }
    }

    const {
      name: newName,
      email: newEmail,
      avatar_id,
    } = await deliveryman.update(req.body);

    return res.json({
      id: req.deliverymanId,
      name: newName,
      email: newEmail,
      avatar_id,
    });
  }

  async delete(req, res) {
    await Deliveryman.destroy({
      where: { id: req.deliverymanId },
    });

    return res.json();
  }
}

export default new DeliverymanController();
