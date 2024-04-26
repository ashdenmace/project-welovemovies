const service = require("./theaters.service");
const reduceProperties = require("../utils/reduce-properties");

async function list(req, res, next) {
  const theatersAndMovies = await service.list();
  const reduceConfig = {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    rating: ["movies", null, "rating"],
    description: ["movies", null, "description"],
    is_showing: ["movies", null, "is_showing"],
    image_url: ["movies", null, "image_url"],
  };
  const reduceTheaterAndMovies = reduceProperties("theater_id", reduceConfig);
  const final = reduceTheaterAndMovies(theatersAndMovies);
  res.json({ data: final });
}

module.exports = {
  list,
};
