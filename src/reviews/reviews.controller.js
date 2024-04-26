const service = require("./reviews.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await service.update(updatedReview);

  const critics = await service.getCritics();
  const critic = critics.find(
    (critic) => critic.critic_id === updatedReview.critic_id
  );

  const data = await service.read(updatedReview.review_id);
  const resData = { ...data, critic };

  res.json({ data: resData });
}

async function destroy(req, res, next) {
  const { review } = res.locals;
  await service.destroy(review.review_id);
  res.sendStatus(204);
}

module.exports = {
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
