import File from '../models/File';
import Deliveryman from '../models/Deliveryman';

class AvatarFileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const { id, url } = await File.create({
      name,
      path,
    });

    await Deliveryman.update(
      { avatar_id: id },
      { where: { id: req.deliverymanId } }
    );

    return res.json({ name, url });
  }
}

export default new AvatarFileController();
