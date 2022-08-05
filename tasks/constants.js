const { CURRENT_SITE } = require("../current-site.json");
const FILE_CONFIG_NAME = "secret-keys.json";
const preprocessor = "scss", // Preprocessor (sass, scss, less, styl),
  preprocessorOn = false;

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
const BASE_DIR = "src"; // Base directory path without «/» at the end
const DIST_DIR = "dist"; // Base directory path without «/» at the end

const Paths = {
  downloadDir: "downloaded-files",
  scripts: {
    src: [
      `${BASE_DIR}/js/main.js`, // app.js. Always at the end
    ],
    dest: `${DIST_DIR}/`,
  },

  styles: {
    src: preprocessorOn
      ? `${BASE_DIR}/${preprocessor}/**.scss`
      : `${BASE_DIR}/css/main.css`,
    dest: `${DIST_DIR}/`,
    all: `${DIST_DIR}/**.css`,
  },
  html: {
    src: `${BASE_DIR}/html`,
    dest: `${DIST_DIR}/html`,
  },
  images: {
    src: `${BASE_DIR}/images/**/*`,
    dest: `${DIST_DIR}/`,
  },
  icons: {
    src: `${BASE_DIR}/icons/**/*.svg`,
    dest: `${DIST_DIR}/`,
  },
  src: {
    scripts: "",
    styles: "",
    html: "",
    icons: "",
    images: "",
  },
  watch: {},
  build: {},
  clean: `${DIST_DIR}/**/*`,
  cssOutputName: "main.css",
  jsOutputName: "main.js",
  buildStatic: `${DIST_DIR}/static`,
};

module.exports = {
  Paths,
  FilesMap,
  CURRENT_SITE,
  URL_MAP,
  FILE_CONFIG_NAME,
  BASE_DIR,
  DIST_DIR,
};
