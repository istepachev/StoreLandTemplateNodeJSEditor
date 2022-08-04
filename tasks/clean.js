const { distDir } = require("./constants");
const del = require("del");

const cleanDist = () => del(`${distDir}/**/*`, { force: true });

module.exports = cleanDist;
