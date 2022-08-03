const { URL_MAP } = require("./tasks/constants");

// VARIABLES & PATHS
const preprocessor = "scss", // Preprocessor (sass, scss, less, styl),
  preprocessorOn = false,
  fontswatch = "woff,woff2,eot,ttf",
  fileswatch = "html,htm", // List of files extensions for watching & hard reload (comma separated)
  imageswatch = "jpg,jpeg,png,webp,svg", // List of images extensions for watching & compression (comma separated)
  baseDir = "src", // Base directory path without «/» at the end
  distDir = "dist", // Base directory path without «/» at the end
  online = true; // If «false» - Browsersync will work offline without internet connection

const paths = {
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

// LOGIC
const DEFAULT_TEMPLATE_VARIABLES = require("./src/html/_template-variables");
const { src, dest, parallel, series, watch } = require("gulp");
const scss = require("gulp-dart-sass");
const bulk = require("gulp-sass-bulk-importer");
const fileinclude = require("gulp-file-include");
const cleancss = require("gulp-clean-css");
// const concat = require("gulp-concat");
// const babel = require("gulp-babel");
// const sourcemaps = require("gulp-sourcemaps");

// const uglify = require("gulp-uglify-es").default;
const svgSprite = require("gulp-svg-sprite");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const del = require("del");
const plumber = require("gulp-plumber");
const replacePath = require("gulp-replace-path");

// Dev depend
const fetch = require("node-fetch");
const fs = require("fs");
const fsPromises = fs.promises;
const { URLSearchParams } = require("url");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment"); // require

exports.browserSync = require("./tasks/browsersync");
exports.fonts = require("./tasks/fonts");

function scripts(filePath = "") {
  const isBuild = typeof filePath === "function";
  const fileName = !isBuild ? path.basename(filePath) : "";
  const parentFileFolderName = !isBuild
    ? path.basename(path.dirname(filePath))
    : "";
  const DEFAULT_JS_PATH_NAME = `default`;

  if (fileName.startsWith(`_`)) {
    console.log(`Файл ${fileName} сохранен, перезагрузи сборку`);
    return;
  }
  if (parentFileFolderName === DEFAULT_JS_PATH_NAME) {
    src([filePath]).pipe(dest(paths.buildStatic));

    return;
  }
  const PATH = !isBuild
    ? filePath
    : ["src/js/**/*.js", `src/js/${DEFAULT_JS_PATH_NAME}/**/*.js`];
  console.log(PATH);
  return (
    src(PATH)
      .pipe(plumber())
      // .pipe(
      //   babel({
      //     presets: ["@babel/env"],
      //   })
      // )
      .pipe(replacePath("/src/js/", ""))
      .pipe(replacePath("src/js/", ""))
      .pipe(replacePath("src/js", ""))
      .pipe(dest(paths.buildStatic))
  );
}

function styles(filePath = "") {
  const isBuild = typeof filePath === "function";
  const file = filePath;
  const fileName = !isBuild ? path.basename(file) : "";

  if (preprocessorOn) {
    const PATH = !isBuild
      ? `${baseDir}/${preprocessor}/**/*.${preprocessor}`
      : `${baseDir}/${preprocessor}/${fileName}`;
    if (isBuild) {
      src([
        `${baseDir}/${preprocessor}/*.css`,
        `${baseDir}/${preprocessor}/default/**`,
      ])
        .pipe(replacePath(`/src/${preprocessor}/default`, ""))
        .pipe(dest(paths.buildStatic));
    }
    src(PATH)
      .pipe(bulk())
      .pipe(plumber())
      .pipe(
        scss({
          includePaths: [`${baseDir}/${preprocessor}/templates/`],
        }).on("error", scss.logError)
      )
      .pipe(
        autoprefixer({
          grid: true,
          overrideBrowserslist: ["last 8 versions"],
          browsers: [
            "Android >= 4",
            "Chrome >= 20",
            "Firefox >= 24",
            "Explorer >= 11",
            "iOS >= 6",
            "Opera >= 12",
            "Safari >= 6",
          ],
        })
      )
      .pipe(
        cleancss({
          format: {
            breaks: {
              // controls where to insert breaks
              afterAtRule: false, // controls if a line break comes after an at-rule; e.g. `@charset`; defaults to `false`
              afterBlockBegins: true, // controls if a line break comes after a block begins; e.g. `@media`; defaults to `false`
              afterBlockEnds: true, // controls if a line break comes after a block ends, defaults to `false`
              afterComment: true, // controls if a line break comes after a comment; defaults to `false`
              afterProperty: false, // controls if a line break comes after a property; defaults to `false`
              afterRuleBegins: false, // controls if a line break comes after a rule begins; defaults to `false`
              afterRuleEnds: true, // controls if a line break comes after a rule ends; defaults to `false`
              beforeBlockEnds: true, // controls if a line break comes before a block ends; defaults to `false`
              betweenSelectors: false, // controls if a line break comes between selectors; defaults to `false`
            },
            breakWith: "\n", // controls the new line character, can be `'\r\n'` or `'\n'` (aliased as `'windows'` and `'unix'` or `'crlf'` and `'lf'`); defaults to system one, so former on Windows and latter on Unix
            indentBy: 0, // controls number of characters to indent with; defaults to `0`
            indentWith: "space", // controls a character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
            spaces: {
              // controls where to insert spaces
              aroundSelectorRelation: true, // controls if spaces come around selector relations; e.g. `div > a`; defaults to `false`
              beforeBlockBegins: true, // controls if a space comes before a block begins; e.g. `.block {`; defaults to `false`
              beforeValue: true, // controls if a space comes before a value; e.g. `width: 1rem`; defaults to `false`
            },
            wrapAt: false, // controls maximum line length; defaults to `false`
          },
        })
      )
      // .pipe(sourcemaps.write("/src/scss/sourcemaps/"))
      .pipe(replacePath("/src/scss/", ""))
      .pipe(dest(paths.buildStatic));
  } else {
    if (isBuild) {
      src([`${baseDir}/css/**/*.css`])
        .pipe(replacePath(`/src/css/default`, ""))
        .pipe(dest(paths.buildStatic));
    } else {
      return src(`${baseDir}/css/${fileName}`)
        .pipe(dest(paths.buildStatic))
        .pipe(browserSync.stream());
    }
  }
  isBuild && filePath();
}

function images() {
  return src([paths.images.src])
    .pipe(newer(paths.images.dest))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 95, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(paths.buildStatic));
}

exports.cleanDist = require("./tasks/clean");

function htmlinclude(filePath = "") {
  const isBuild = typeof filePath === "function";
  const file = !isBuild && filePath;
  const fileName = !isBuild ? path.basename(filePath) : "";

  if (!isBuild && file && fileName.startsWith(`_`)) {
    fs.readFile(`${file}`, { encoding: "utf8" }, (err, data) => {
      if (err) throw err;
      if (!data.length) {
        console.error(`⛔ Файл пуст`);

        return;
      }
      const firstStrFile = data.split("\n").shift();
      const isFirstComment = firstStrFile.match(/\[([^}]*)]/);
      if (!isFirstComment) {
        console.error(
          `⛔ Путь до файла/файлов родителей не указан в 1й строке. Пример: <!-- [html.htm] -->`
        );

        return;
      }

      const filespath = firstStrFile
        .match(/\[([^}]*)]/)[1]
        .trim()
        .split(",")
        .map((el) => `${baseDir}/html/${el.trim()}`);

      return src(filespath)
        .pipe(plumber())
        .pipe(
          fileinclude({
            prefix: "@@",
            basepath: "@file",
            context: DEFAULT_TEMPLATE_VARIABLES,
          })
        )
        .pipe(replacePath("/src/html/", ""))
        .pipe(dest(paths.html.dest));
    });
  } else {
    const PATH = !isBuild
      ? filePath
      : ["src/html/**/*.htm", "!src/html/_templates/**/*.{html, htm}"];
    return src(PATH)
      .pipe(plumber())
      .pipe(
        fileinclude({
          prefix: "@@",
          basepath: "@file",
          context: DEFAULT_TEMPLATE_VARIABLES,
        })
      )
      .pipe(replacePath("/src/html/", ""))
      .pipe(dest(paths.html.dest));
  }
}
function icons() {
  return src(paths.icons.src) // svg files for sprite
    .pipe(
      svgSprite({
        mode: {
          symbol: {
            dest: ".",
            sprite: "sprite.svg",
          },
        },
      })
    )
    .pipe(dest(distDir));
}
function startwatch() {
  // Стили
  const pathStyleFiles = preprocessorOn
    ? `${baseDir}/${preprocessor}/**/*.${preprocessor}`
    : `${baseDir}/css/**/*.css`;
  watch(pathStyleFiles).on("add", styles).on("change", styles);
  watch(`${distDir}/**/*.css`).on("add", uploadFile).on("change", uploadFile);
  // Изображения
  watch(`${distDir}/**/*.{${imageswatch}}`)
    .on("add", uploadFile)
    .on("change", uploadFile);
  // Svg иконки
  watch(`${baseDir}/icons/**/*.svg`).on("add", icons).on("change", icons);
  // Шрифты
  watch(`${distDir}/**/*.{${fontswatch}}`)
    .on("add", uploadFile)
    .on("change", uploadFile);
  watch(`${baseDir}/**/*.{${fontswatch}}`).on("change", exports.fonts);
  // Html
  watch(`${baseDir}/**/*.{${fileswatch}}`).on("change", htmlinclude);
  watch(`${distDir}/**/*.{${fileswatch}}`)
    .on("change", uploadFile)
    .on("add", uploadFile);
  // Javascript
  watch(`${baseDir}/**/*.js`).on("change", scripts).on("add", scripts);
  // watch(`${distDir}"/**/*.js`).on("change", uploadFile).on("add", uploadFile);
  watch(`${distDir}/**/*.js`).on("change", uploadFile).on("add", uploadFile);
}

function uploadFile(event, cb = () => {}) {
  async function getFileContent() {
    const file = event;
    const fileName = path.basename(file);

    try {
      const filehandle = await fsPromises.open(`${file}`, "r+");
      const data = await filehandle.readFile("base64");
      filehandle.close();
      return { data, fileName };
    } catch (e) {
      console.log("Error", e);
    }
  }
  getFileContent()
    .then(({ data, fileName }) => {
      const params = new URLSearchParams({
        secret_key: SECRET_KEY,
        "form[file_name]": `${fileName}`,
        "form[file_content]": `${data}`,
      });
      if (fileName.includes("css")) {
        // params.append("form[do_not_receive_file]", `1`);
      }

      fetch(URL_MAP.save, {
        method: "post",
        body: params,
        timeout: 5000,
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status === `ok`) {
            console.log(
              `[${moment().format("HH:mm:ss")}] Файл ${chalk.red(
                fileName
              )} успешно отправлен ✔️`
            );
            if (!fileName.includes("css")) {
              browserSync.reload();
            }
            if (fileName.includes("css")) {
              browserSync.reload("*.css");
            }
            if (typeof cb === "function") {
              cb();
            }
          } else if (json.status === `error`) {
            console.log(
              chalk.redBright(`Ошибка отправки ⛔ ${chalk.gray(fileName)}`),
              chalk.redBright(`${json.message}`)
            );
          }
        });
    })
    .catch(console.error);
}
const { checkConfig } = require("./tasks/config-check");
exports.checkConfig = checkConfig;
exports.downloadFiles = require("./tasks/downloadFiles");

exports.build = parallel(
  exports.cleanDist,
  htmlinclude,
  scripts,
  images,
  exports.fonts,
  styles,
  icons
);
exports.download = series(exports.checkConfig, exports.downloadFiles);
exports.default = parallel(
  exports.checkConfig,
  exports.browserSync,
  startwatch
);
