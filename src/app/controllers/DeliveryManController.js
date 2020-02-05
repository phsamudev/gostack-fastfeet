import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await DeliveryMan.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Delivery man already exists' });
    }

    const { id, name, email } = await DeliveryMan.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    if (page < 1) {
      return res.status(401).json({ error: 'Invalid page number' });
    }

    const { id } = req.params;

    if (id) {
      const deliveryman = await DeliveryMan.findByPk(id, {
        attributes: ['id', 'name', 'email'],
      });

      if (!deliveryman) {
        return res.status(400).json({ error: "Deliveryman doesn't exist" });
      }

      return res.json(deliveryman);
    }

    const deliverymen = await DeliveryMan.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'name', 'email'],
    });

    return res.json(deliverymen);
  }
}

export default new DeliveryManController();
