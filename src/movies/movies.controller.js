const service = require("./movies.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function doesMovieExist(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);

  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie ID could not be found" });
}

async function list(req, res, next) {
  const { is_showing } = req.query;
  if (is_showing) {
    const data = await service.listMoviesShowing();
    res.json({
      data,
    });
  } else {
    const data = await service.list();
    res.json({
      data,
    });
  }
}

async function read(req, res, next) {
  const { movie } = res.locals;

  res.json({
    data: movie,
  });
}

async function listTheatersForMovie(req, res, next) {
  const { movieId } = req.params;

  const data = await service.listTheatersForMovie(movieId);
  res.json({ data });
}

async function listReviews(req, res, next) {
  const { movie } = res.locals;
  const reviews = await service.listReviews(movie.movie_id);
  const critics = await service.getCritics();

  const data = reviews.map((review) => {
    const critic = critics.find(
      (critic) => critic.critic_id === review.critic_id
    );
    return { ...review, critic };
  });

  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(doesMovieExist), asyncErrorBoundary(read)],
  listTheatersForMovie: [
    asyncErrorBoundary(doesMovieExist),
    asyncErrorBoundary(listTheatersForMovie),
  ],
  listReviews: [
    asyncErrorBoundary(doesMovieExist),
    asyncErrorBoundary(listReviews),
  ],
};
