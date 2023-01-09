import { createRequire } from "module";
const require = createRequire(import.meta.url);
const FILE_CURRENT_SITE_NAME = "current-site.json";
const { CURRENT_SITE } = require(`../${FILE_CURRENT_SITE_NAME}`);
const FILE_CONFIG_NAME = "secret-keys.json";
const PREPROCESSOR = "scss";
const PREPROCESSOR_ON = false;

const Folders = {
  Html: "html",
  Images: "images",
  Fonts: "fonts",
  Js: "js",
  Css: "css",
  Icons: "icons",
};

const Files = {
  Html: "htm, html",
  Images: "png, jpg, jpeg, gif",
  Fonts: "eot, ttf, woff, woff2",
  Js: "js",
  Css: "css",
  Icons: "svg",
};

const URL_MAP = {
  save: `${CURRENT_SITE}/api/v1/site_files/save`,
  get_list: `${CURRENT_SITE}/api/v1/site_files/get_list`,
  get_file: `${CURRENT_SITE}/api/v1/site_files/get`,
};
const BASE_DIR = "src";
const DIST_DIR = "dist";
const STATIC_DIR = `${DIST_DIR}/static`;
const DOWNLOAD_DIR = "downloads";
const DEFAULT_FOLDER_NAME = `default`;

const Paths = {
  scripts: {
    watch: `${BASE_DIR}/**/*.${Files.Js}`,
    dest: STATIC_DIR,
    build: [`${BASE_DIR}/${Folders.Js}/**/*.${Files.Js}`],
  },
  styles: {
    src: PREPROCESSOR_ON
      ? `${BASE_DIR}/${PREPROCESSOR}`
      : `${BASE_DIR}/${Folders.Css}`,
    watch: PREPROCESSOR_ON
      ? `${BASE_DIR}/${PREPROCESSOR}/**.${PREPROCESSOR}`
      : `${BASE_DIR}/${Folders.Css}/**/.${Files.Css}`,
    dest: STATIC_DIR,
    build: PREPROCESSOR_ON
      ? [
          `${BASE_DIR}/${PREPROCESSOR}/.${Files.Css}`,
          `${BASE_DIR}/${PREPROCESSOR}/${DEFAULT_FOLDER_NAME}/**`,
        ]
      : [`${BASE_DIR}/${Folders.Css}/**/.${Files.Css}`],
  },
  html: {
    src: `${BASE_DIR}/${Folders.Html}`,
    watch: `${BASE_DIR}/**/*.{${Files.Html}}`,
    dest: `${DIST_DIR}/${Folders.Html}`,
    build: [
      `${BASE_DIR}/${Folders.Html}/**/*.${Files.Html}`,
      `!${BASE_DIR}/${Folders.Html}/_templates/**/*.{${Files.Html}}`,
    ],
  },
  fonts: {
    watch: `${BASE_DIR}/${Folders.Fonts}/**/*.{${Files.Fonts}}`,
    dest: STATIC_DIR,
  },
  images: {
    watch: `${BASE_DIR}/${Folders.Images}/**/*.{${Files.Images}}`,
    dest: STATIC_DIR,
  },
  icons: {
    watch: `${BASE_DIR}/${Folders.Icons}/**/*.{${Files.Icons}}`,
    dest: STATIC_DIR,
  },
};

export {
  PREPROCESSOR,
  PREPROCESSOR_ON,
  Paths,
  Files,
  CURRENT_SITE,
  URL_MAP,
  FILE_CONFIG_NAME,
  FILE_CURRENT_SITE_NAME,
  BASE_DIR,
  DIST_DIR,
  DEFAULT_FOLDER_NAME,
  DOWNLOAD_DIR,
};
