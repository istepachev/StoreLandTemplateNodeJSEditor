import { createRequire } from "module";
const require = createRequire(import.meta.url);
const FILE_CURRENT_SITE_NAME = "current-site.json";
const { CURRENT_SITE } = require(`../${FILE_CURRENT_SITE_NAME}`);
const FILE_CONFIG_NAME = "secret-keys.json";
const FILE_HTML_TEMPLATE_NAME = "_template-variables.json";
const PREPROCESSOR = "scss";
const PREPROCESSOR_ON = false;
const IS_BUILD = process.env.NODE_ENV === "production";

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

const API_BASE_URL = `${CURRENT_SITE}/api/v1/site_files`;

const URL_MAP = {
  save: `${API_BASE_URL}/save`,
  getList: `${API_BASE_URL}/get_list`,
  getFile: `${API_BASE_URL}/get`,
};

const BASE_DIR = "src";
const DIST_DIR = "dist";
const STATIC_DIR = `${DIST_DIR}/static`;
const DOWNLOAD_DIR = "downloads";
const DEFAULT_FOLDER_NAME = `default`;

const Paths = {
  htmlTemplateJsonDefault: `${BASE_DIR}/${Folders.Html}/${FILE_HTML_TEMPLATE_NAME}`,
  htmlTemplateJson: `${BASE_DIR}/${Folders.Html}/**/*.json`,
  dist: `${DIST_DIR}/**/*.*`,
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
      : `${BASE_DIR}/${Folders.Css}/**/*.${Files.Css}`,
    dest: STATIC_DIR,
    build: PREPROCESSOR_ON
      ? [
          `${BASE_DIR}/${PREPROCESSOR}/.${Files.Css}`,
          `${BASE_DIR}/${PREPROCESSOR}/${DEFAULT_FOLDER_NAME}/**`,
        ]
      : [`${BASE_DIR}/${Folders.Css}/**/*.${Files.Css}`],
  },
  html: {
    default: `${BASE_DIR}/${Folders.Html}/html.htm`,
    src: `${BASE_DIR}/${Folders.Html}`,
    watch: `${BASE_DIR}/**/*.{${Files.Html}}`,
    dest: `${DIST_DIR}/${Folders.Html}`,
    build: [
      `${BASE_DIR}/${Folders.Html}/**/*.{${Files.Html}}`,
      //`!${BASE_DIR}/${Folders.Html}/**/[_].{${Files.Html}}`, //TODO поддержка любой вложенности
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

const Config = {
  files: {
    currentSite: FILE_CURRENT_SITE_NAME,
    config: FILE_CONFIG_NAME,
    htmlTemplate: FILE_HTML_TEMPLATE_NAME,
  },
  folders: Folders,
  fileTypes: Files,
  paths: Paths,
  urls: URL_MAP,
  env: {
    isProd: IS_BUILD,
    preprocessor: {
      type: PREPROCESSOR,
      enabled: PREPROCESSOR_ON,
    },
  },
  dirs: {
    base: BASE_DIR,
    dist: DIST_DIR,
    static: STATIC_DIR,
    download: DOWNLOAD_DIR,
    default: DEFAULT_FOLDER_NAME,
  },
};

export default Config;
