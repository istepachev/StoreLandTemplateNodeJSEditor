const { CURRENT_SITE } = require("../current-site.json");
const FILE_CONFIG_NAME = "secret-keys.json";
// VARIABLES & PATHS
const preprocessor = "scss", // Preprocessor (sass, scss, less, styl),
  preprocessorOn = false,
  fontswatch = "woff,woff2,eot,ttf",
  fileswatch = "html,htm", // List of files extensions for watching & hard reload (comma separated)
  imageswatch = "jpg,jpeg,png,webp,svg", // List of images extensions for watching & compression (comma separated)
  baseDir = "src", // Base directory path without «/» at the end
  distDir = "dist", // Base directory path without «/» at the end
  online = true; // If «false» - Browsersync will work offline without internet connection

const FilesMap = {
  html: ["htm", "html"],
  images: ["png", "jpg", "jpeg", "gif"],
  fonts: ["eot", "ttf", "woff", "woff2"],
  js: ["js"],
  css: ["css"],
  icons: ["svg"],
  getFilesStr: (str) => FilesMap[str].join(),
};

const URL_MAP = {
  save: `${CURRENT_SITE}/api/v1/site_files/save`,
  get_list: `${CURRENT_SITE}/api/v1/site_files/get_list`,
  get_file: `${CURRENT_SITE}/api/v1/site_files/get`,
};

const Paths = {
  baseDir: "src",
  distDir: "dist",
  downloadDir: "downloaded-files",
  scripts: {
    src: [
      baseDir + "/js/main.js", // app.js. Always at the end
    ],
    dest: distDir + "/",
  },

  styles: {
    src: preprocessorOn
      ? baseDir + "/" + preprocessor + "/**.scss"
      : baseDir + "/" + "css" + +"/main.css",
    dest: distDir + "/",
    all: distDir + "/**.css",
  },
  html: {
    src: baseDir + "/html",
    dest: distDir + "/html",
  },
  images: {
    src: baseDir + "/images/**/*",
    dest: distDir + "/",
  },
  icons: {
    src: baseDir + "/icons/**/*.svg",
    dest: distDir + "/",
  },
  cssOutputName: "main.css",
  jsOutputName: "main.js",
  buildStatic: distDir + "/static",
};

module.exports = { Paths, FilesMap, CURRENT_SITE, URL_MAP, FILE_CONFIG_NAME };
