import { createRequire } from "module";
const require = createRequire(import.meta.url);
const FILE_CURRENT_SITE_NAME = "current-site.json";
const { CURRENT_SITE } = require(`../${FILE_CURRENT_SITE_NAME}`);
const FILE_CONFIG_NAME = "secret-keys.json";
const FILE_HTML_TEMPLATE_NAME = "_template-variables.json";

const FoldersNames = {
  Html: "html",
  Images: "images",
  Fonts: "fonts",
  Js: "js",
  Css: "css",
  Icons: "icons",
};

const FilesExtensions = {
  Html: "htm, html",
  Images: "png, jpg, jpeg, gif",
  Fonts: "eot, ttf, woff, woff2",
  Js: "js",
  Css: "css",
  Icons: "svg",
};

const API_BASE_URL = `${CURRENT_SITE}/api/v1/site_files`;

const ApiUrls = {
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
  htmlTemplate: {
    default: `${BASE_DIR}/${FoldersNames.Html}/${FILE_HTML_TEMPLATE_NAME}`,
    all: `${BASE_DIR}/${FoldersNames.Html}/**/*.json`,
  },
  dist: `${DIST_DIR}/**/*.*`,
  scripts: {
    watch: `${BASE_DIR}/**/*.${FilesExtensions.Js}`,
    dest: STATIC_DIR,
    build: [`${BASE_DIR}/${FoldersNames.Js}/**/*.${FilesExtensions.Js}`],
  },
  styles: {
    src: `${BASE_DIR}/${FoldersNames.Css}`,
    watch: `${BASE_DIR}/${FoldersNames.Css}/**/*.${FilesExtensions.Css}`,
    dest: STATIC_DIR,
    build: [`${BASE_DIR}/${FoldersNames.Css}/**/*.${FilesExtensions.Css}`],
  },
  html: {
    default: `${BASE_DIR}/${FoldersNames.Html}/html.htm`,
    src: `${BASE_DIR}/${FoldersNames.Html}`,
    watch: `${BASE_DIR}/**/*.{${FilesExtensions.Html}}`,
    dest: `${DIST_DIR}/${FoldersNames.Html}`,
    build: [
      `${BASE_DIR}/${FoldersNames.Html}/**/*.{${FilesExtensions.Html}}`,
      //`!${BASE_DIR}/${FoldersNames.Html}/**/[_].{${FilesExtensions.Html}}`, //TODO поддержка любой вложенности
    ],
  },
  fonts: {
    watch: `${BASE_DIR}/${FoldersNames.Fonts}/**/*.{${FilesExtensions.Fonts}}`,
    dest: STATIC_DIR,
  },
  images: {
    watch: `${BASE_DIR}/${FoldersNames.Images}/**/*.{${FilesExtensions.Images}}`,
    dest: STATIC_DIR,
  },
  icons: {
    watch: `${BASE_DIR}/${FoldersNames.Icons}/**/*.{${FilesExtensions.Icons}}`,
    dest: STATIC_DIR,
  },
};

const Config = {
  CURRENT_SITE,
  files: {
    currentSite: FILE_CURRENT_SITE_NAME,
    config: FILE_CONFIG_NAME,
    htmlTemplate: FILE_HTML_TEMPLATE_NAME,
  },
  FoldersNames,
  FilesExtensions,
  Paths,
  ApiUrls,
  env: {
    isProd: process.env.NODE_ENV === "production",
  },
  dirs: {
    BASE_DIR,
    DIST_DIR,
    STATIC_DIR,
    DOWNLOAD_DIR,
    DEFAULT_FOLDER_NAME,
  },
};

export default Config;
