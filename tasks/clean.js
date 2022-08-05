const { Paths } = require("./constants");
const del = require("del");

const cleanDist = () => del(Paths.clean, { force: true });

module.exports = cleanDist;
