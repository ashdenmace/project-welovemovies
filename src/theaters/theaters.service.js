const knex = require("../db/connection");

function list() {
  return knex("theaters as t")
    .leftJoin("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .leftJoin("movies as m", "mt.movie_id", "m.movie_id")
    .select("*");
}

module.exports = {
  list,
};
