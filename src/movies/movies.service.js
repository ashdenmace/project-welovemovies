const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function listMoviesShowing() {
  return knex("movies as m")
    .distinct()
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select(
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where({ is_showing: true });
}

function listTheatersForMovie(movieId) {
  return knex("theaters as t")
    .distinct()
    .join("movies_theaters as mt", "mt.theater_id", "t.theater_id")
    .select("*")
    .where({ movie_id: movieId });
}

function listReviews(movieId) {
  return knex("reviews as r")
    .distinct()
    .select("*")
    .where({ movie_id: movieId });
}

function getCritics() {
  return knex("critics as c").select("*");
}

module.exports = {
  list,
  read,
  listMoviesShowing,
  listTheatersForMovie,
  listReviews,
  getCritics,
};
