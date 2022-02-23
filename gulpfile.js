// VARIABLES & PATHS

let preprocessor = "scss", // Preprocessor (sass, scss, less, styl),
  preprocessorOn = true,
  fontswatch = "woff,woff2,eot,ttf",
  fileswatch = "html,htm", // List of files extensions for watching & hard reload (comma separated)
  imageswatch = "jpg,jpeg,png,webp,svg", // List of images extensions for watching & compression (comma separated)
  baseDir = "src", // Base directory path without «/» at the end
  distDir = "dist", // Base directory path without «/» at the end
  online = true; // If «false» - Browsersync will work offline without internet connection

let paths = {
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
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
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

const { CURRENT_SITE } = require("./current-site.json"); // Текущий url адрес сайта, с которым работаем
const FILE_CONFIG_NAME = "secret-keys.json";
try {
  require(`./${FILE_CONFIG_NAME}`);
} catch (error) {
  createSecretFile(CURRENT_SITE, FILE_CONFIG_NAME);
}
const { SECRET_KEY } = require(`./${FILE_CONFIG_NAME}`)[CURRENT_SITE]; // Секретный ключ текущего сайта

function checkConfig(cb) {
  if (!CURRENT_SITE) {
    cb(
      new Error(
        `Не задан url адрес ${chalk.red(`CURRENT_SITE`)} в файле ` +
          chalk.red(`current-site.json`)
      )
    );
  }
  if (!SECRET_KEY) {
    cb(
      new Error(
        `Не задан ${chalk.red(`SECRET_KEY`)} в файле ` +
          chalk.red(FILE_CONFIG_NAME)
      )
    );
  }

  cb();
}
const URL_MAP = {
  save: `${CURRENT_SITE}/api/v1/site_files/save`,
  get_list: `${CURRENT_SITE}/api/v1/site_files/get_list`,
  get_file: `${CURRENT_SITE}/api/v1/site_files/get`,
};

function browsersync() {
  browserSync.init({
    notify: false,
    proxy: {
      target: `${CURRENT_SITE}`,
      proxyReq: [
        function (proxyReq) {
          proxyReq.setHeader("x-nodejs-editor-version", "1.01");
        },
      ],
    },
    online,
    injectChanges: true,
    open: "external",
    port: 8088,
  });
}
function fonts(filePath) {
  const isBuild = typeof filePath == "function";
  if (isBuild) {
    filePath = [
      "src/fonts/**/*.ttf",
      "src/fonts/**/*.eot",
      "src/fonts/**/*.woff",
      "src/fonts/**/*.woff2",
    ];
  }
  return src(filePath).pipe(plumber()).pipe(dest(paths.buildStatic));
}

function scripts(filePath = "") {
  const isBuild = typeof filePath == "function";
  const fileName = !isBuild ? path.basename(filePath) : "";
  const parentFileFolder = !isBuild
    ? path.basename(path.dirname(filePath))
    : "";
  const DEFAULT_JS_PATH = `default`;

  if (fileName.startsWith(`_`)) {
    console.log(`Файл ${fileName} сохранен, перезагрузи сборку`);
    return;
  }
  if (parentFileFolder === DEFAULT_JS_PATH || isBuild) {
    if (isBuild) {
      filePath = `src/js/${DEFAULT_JS_PATH}/**/*.js`;
    }
    src([filePath]).pipe(dest(paths.buildStatic));
    if (!isBuild) {
      return;
    }
  }
  const PATH = !isBuild
    ? filePath
    : ["src/js/**/*.js", `!src/js/${DEFAULT_JS_PATH}/**/*.js`];
  return src(PATH)
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(dest(paths.buildStatic));
}

function styles(filePath = "") {
  const isBuild = typeof filePath == "function";
  let file = filePath;
  let fileName = !isBuild ? path.basename(file) : "";

  if (preprocessorOn) {
    const PATH = !isBuild
      ? `${baseDir}/${preprocessor}/${fileName}`
      : `${baseDir}/${preprocessor}/**/*.${preprocessor}`;
    if (isBuild) {
      src([
        `${baseDir}/${preprocessor}/*.css`,
        `${baseDir}/${preprocessor}/default/**`,
      ])
        .pipe(replacePath(`/src/${preprocessor}/default`, ""))
        .pipe(dest(paths.buildStatic));
    }
    src(PATH)
      .pipe(sourcemaps.init())
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
      .pipe(sourcemaps.write("../sourcemaps/"))
      .pipe(dest(paths.buildStatic));
  } else {
    if (fileName) {
      return src(`${baseDir}/${fileName}`).pipe(browserSync.stream());
    } else {
      return src(paths.buildStatic).pipe(browserSync.stream());
    }
  }
  isBuild && filePath();
}

function images() {
  return src([paths.images.src, `!${baseDir}/images/*.md`])
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

function cleanDist() {
  return del("" + distDir + "/**/*", { force: true });
}

function htmlinclude(filePath = "") {
  const isBuild = typeof filePath == "function";
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
          `⛔ Путь до файла/файлов родителей не указан в 1й строке. Пример: <!-- [html.htm] --> `
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
      : [
          "src/html/**/*.htm",
          "!src/html/_templates/**/*.html",
          "!src/html/_templates/**/*.htm",
        ];
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
  if (preprocessorOn) {
    watch(baseDir + "/**/*.scss").on("change", function (event) {
      styles(event);
    });
  }
  watch(distDir + "/**/*.css")
    .on("add", function (event) {
      uploadFile(event);
    })
    .on("change", function (event) {
      uploadFile(event);
    });
  // Изображения
  watch(distDir + "/**/*.{" + imageswatch + "}")
    .on("add", function (event) {
      uploadFile(event);
    })
    .on("change", function (event) {
      uploadFile(event);
    });
  // Svg иконки
  watch(baseDir + "/icons/**/*.{" + "svg" + "}")
    .on("add", icons)
    .on("change", icons);
  // Шрифты
  watch(distDir + "/**/*.{" + fontswatch + "}")
    .on("add", function (event) {
      uploadFile(event);
    })
    .on("change", function (event) {
      uploadFile(event);
    });
  watch(baseDir + "/**/*.{" + fontswatch + "}").on("change", function (event) {
    fonts(event);
  });
  // Html
  watch(baseDir + "/**/*.{" + fileswatch + "}").on("change", function (event) {
    htmlinclude(event);
  });
  watch(distDir + "/**/*.{" + fileswatch + "}")
    .on("change", function (event) {
      uploadFile(event);
    })
    .on("add", function (event) {
      uploadFile(event);
    });
  // Javascript
  watch([baseDir + "/**/*.js"])
    .on("change", function (event) {
      scripts(event);
    })
    .on("add", function (event) {
      scripts(event);
    });
  watch(distDir + "/**/*.js")
    .on("add", function (event) {
      uploadFile(event);
    })
    .on("change", function (event) {
      uploadFile(event);
    });
}

function uploadFile(event, cb) {
  async function getFileContent() {
    let filehandle = null;
    let file = event;
    let fileName = path.basename(file);

    try {
      filehandle = await fsPromises.open(`${file}`, "r+");
      const data = await filehandle.readFile("base64");
      filehandle.close();
      return { data, fileName };
    } catch (e) {
      console.log("Error", e);
    }
  }
  getFileContent()
    .then(({ data, fileName }) => {
      let params = new URLSearchParams();
      params.append("secret_key", SECRET_KEY);
      params.append("form[file_name]", `${fileName}`);
      params.append("form[file_content]", `${data}`);
      if (fileName.includes("css")) {
        // params.append("form[do_not_receive_file]", `1`);
      }

      fetch(URL_MAP.save, {
        method: "post",
        body: params,
        timeout: 5000,
      })
        .then((res) => {
          return res.json();
        })
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
            if (cb) {
              cb();
            }
          } else if (json.status == `error`) {
            console.log(`Ошибка отправки ⛔ ${fileName}`);
            console.log(`${json.message}`);
          }
        });
    })
    .catch(console.error);
}

function downloadFiles(done) {
  const FILES_PATH = `./${paths.downloadDir}`;
  let params = new URLSearchParams();
  params.append("secret_key", SECRET_KEY);

  fetch(URL_MAP.get_list, {
    method: "post",
    body: params,
    timeout: 10000,
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.status === `ok`) {
        console.log(`Загружен список всех файлов ✔️`);

        if (!fs.existsSync(FILES_PATH)) {
          fs.mkdirSync(FILES_PATH);
        }
        const filesArray = json.data.map((item) => {
          return {
            file_id: item["file_id"]["value"],
            file_name: item["file_name"]["value"],
          };
        });
        return filesArray;
      } else if (json.status == `error`) {
        console.log(`Ошибка загрузки ⛔`);
      }
    })
    .then((array) => {
      console.log(`Всего файлов ${array.length}`);
      const arrLength = array.length;
      let count = 1;
      const getFile = (arr) => {
        if (!arr.length) {
          console.log(`Всего скачано файлов ${count} из ${arrLength}`);
          done();
          return;
        }
        const { file_id, file_name } = arr.shift();

        let params = new URLSearchParams();
        params.append("secret_key", SECRET_KEY);

        fetch(`${URL_MAP.get_file}/${file_id}`, {
          method: "post",
          body: params,
          timeout: 10000,
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.status === `ok`) {
              return json;
            }
          })
          .then((json) => {
            const file = json["data"]["file_name"].value;
            const fileContent = json["data"]["file_content"].value;
            const fileExt = path.extname(file).replace(".", "");

            const FILES_MAP = {
              html: ["htm", "html"],
              images: ["png", "jpg", "jpeg", "gif"],
              fonts: ["eot", "ttf", "woff", "woff2"],
              js: ["js"],
              css: ["css"],
              svg: ["svg"],
            };

            let fileDirName = "";

            for (const key in FILES_MAP) {
              if (Object.hasOwnProperty.call(FILES_MAP, key)) {
                const extArr = FILES_MAP[key];
                if (extArr.includes(fileExt)) {
                  fileDirName = key;
                }
              }
            }

            const newDir = `${FILES_PATH}/${fileDirName}`;
            !fs.existsSync(newDir) && fs.mkdirSync(newDir);

            fs.writeFile(
              `${FILES_PATH}/${fileDirName}/${file}`,
              fileContent,
              "base64",
              function (err) {
                if (err) {
                  console.log(err);
                }

                console.log(
                  `Скачан файл ${file_name}. Всего ${count} из ${arrLength}`
                );
                getFile(array);
                count++;
              }
            );
          })
          .catch(console.log);
      };
      getFile(array);
    });
}
function createSecretFile(siteUrl = "", fileName = "") {
  const fileContent = `{
    "${siteUrl}": {
      "SECRET_KEY": ""
    }
  }
  `;

  fs.writeFileSync(fileName, fileContent);
}

exports.build = parallel(
  cleanDist,
  htmlinclude,
  scripts,
  images,
  fonts,
  styles,
  icons
);
exports.download = series(checkConfig, downloadFiles);
exports.default = parallel(checkConfig, browsersync, startwatch);
