import DeliveryProblem from '../models/DeliveryProblem';

export default async (req, res, next) => {
  const problem = await DeliveryProblem.findByPk(req.params.problemId);

  if (!problem) {
    return res.status(400).json({ error: "Problem doesn't exist" });
  }

  req.problemId = problem.id;

  return next();
};
