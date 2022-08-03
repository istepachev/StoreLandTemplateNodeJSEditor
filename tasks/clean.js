const { distDir } = require("./constants");

const cleanDist = () => del(`${distDir}/**/*`, { force: true });

module.exports = cleanDist;
