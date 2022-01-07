// VARIABLES & PATHS
let preprocessor = "scss", // Preprocessor (sass, scss, less, styl),
  preprocessorOn = true,
  fileswatch = "html,htm", // List of files extensions for watching & hard reload (comma separated)
  imageswatch = "jpg,jpeg,png,webp,svg", // List of images extensions for watching & compression (comma separated)
  baseDir = "src", // Base directory path without «/» at the end
  distDir = "dist", // Base directory path without «/» at the end
  online = true, // If «false» - Browsersync will work offline without internet connection
  WAIT_TIME = 0; // Время задержки перед обновлением страницы.

let paths = {
  baseDir: "src",
  distDir: "dist",
  downloadDir: "downloaded-files",
  scripts: {
    src: [
      // 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
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

  images: {
    src: baseDir + "/images/**/*",
    dest: distDir + "/",
  },
  cssOutputName: "main.css",
  jsOutputName: "main.js",
};

// LOGIC
const { src, dest, parallel, series, watch } = require("gulp");
// const scss         = require('gulp-sass');
const scss = require("gulp-dart-sass");
const fileinclude = require("gulp-file-include");
const cleancss = require("gulp-clean-css");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const del = require("del");
const wait = require("gulp-wait");
const plumber = require("gulp-plumber");

// Dev depend
const fetch = require("node-fetch");
const fs = require("fs");
const fsPromises = fs.promises;
const { base64encode } = require("nodejs-base64");
const { URLSearchParams } = require("url");
const path = require("path");
const chalk = require("chalk");
const moment = require("moment"); // require

const { CURRENT_SITE } = require("./storeland-uploader-config.json"); // Текущий url адрес сайта, с которым работаем
const SECRET_KEYS = require("./secret-keys.json"); // JSON карта сайтов с секретными ключами
const { SECRET_KEY } = SECRET_KEYS[CURRENT_SITE]; // Секретный ключ текущего сайта

function checkConfig(cb) {
  if (!CURRENT_SITE) {
    cb(
      new Error(
        `Не задан url адрес ${chalk.red(`CURRENT_SITE`)} в файле ` +
          chalk.red(`storeland-uploader-config.json`)
      )
    );
  }
  if (!SECRET_KEY) {
    cb(
      new Error(
        `Не задан ${chalk.red(`SECRET_KEY`)} в файле ` +
          chalk.red(`secret-key.json`)
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
    // files: `${distDir}/*.css`
  });
}

function scripts(event = {}) {
  let file = event;

  const ONLY_TRANSFER_FILES = [
    `!${baseDir}/js/forall.js`,
    `!${baseDir}/js/smart-search.js`,
  ];
  src(ONLY_TRANSFER_FILES.map((el) => el.substr(1))).pipe(
    dest(paths.scripts.dest)
  );

  return src([`${baseDir}/**/*.js`, ...ONLY_TRANSFER_FILES])
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(dest(paths.scripts.dest));
}

function styles(event = {}) {
  let file = event;
  let fileName = path.basename(file);
  // let fileNameOnly = path.basename(file, `.${preprocessor}`);

  let PATH;

  if (preprocessorOn) {
    PATH = `${baseDir}/${preprocessor}/${fileName}`;
    src(PATH)
      .pipe(plumber())
      .pipe(
        eval(preprocessor)({
          includePaths: [`${baseDir}/${preprocessor}/templates/`],
        })
      )
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 2 versions"],
          grid: true,
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
      .pipe(dest(paths.styles.dest));
    // .pipe(browserSync.stream());
    // .pipe(browserSync.stream({match: `${distDir}/*.css`}));
    // browserSync.reload(`${distDir}/${fileNameOnly}.css`)
  } else {
    if (fileName) {
      return src(`${baseDir}/${fileName}`).pipe(browserSync.stream());
    } else {
      return src(paths.styles.all).pipe(browserSync.stream());
    }
  }
}

function images() {
  return src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(dest(paths.images.dest));
}

function cleanimg() {
  return del("" + paths.images.dest + "/**/*", { force: true });
}
function htmlinclude(event) {
  let file = event;
  let fileName = path.basename(file);
  let filePath = file.split("\\").join("/");
  let PATH;

  if (fileName.startsWith(`_`)) {
    fs.readFile(`${file}`, { encoding: "utf8" }, (err, data) => {
      if (err) throw err;
      PATH = data
        .split("\n")
        .shift()
        .match(/\[([^}]*)]/)[1]
        .trim()
        .split(",")
        .map((el) => `${baseDir}/html/**/${el.trim()}`);

      const pathInStart = data.split("\n").shift().trim().startsWith(`<!--`);

      if (!pathInStart) {
        console.error(
          ` ⛔ Путь до файла/файлов родителей не указан в 1й строке. Пример: <!-- [html.htm] --> `
        );

        return;
      }

      return src(PATH)
        .pipe(
          fileinclude({
            prefix: "@@",
            basepath: "@file",
          })
        )
        .pipe(dest("dist"));
    });
  } else {
    PATH = `${filePath}`;

    return src([PATH])
      .pipe(
        fileinclude({
          prefix: "@@",
          basepath: "@file",
        })
      )
      .pipe(dest("dist"));
  }
}

function startwatch() {
  // Стили
  if (preprocessorOn) {
    // watch(baseDir  + '/**/*.scss', { delay: 100 }, function (evt) {			styles(evt)		});
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
  watch(distDir + "/**/*.{" + imageswatch + "}");
  watch(distDir + "/**/*.{" + imageswatch + "}")
    .on("add", function (event) {
      uploadFile(event);
    })
    .on("change", function (event) {
      uploadFile(event);
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
  watch([baseDir + "/**/*.js"]).on("change", function (event) {
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
      // if(fileName.includes('css')){
      params.append("form[do_not_receive_file]", `1`);
      // }

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
    timeout: 5000,
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
          timeout: 5000,
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
exports.browsersync = browsersync;
exports.download = series(checkConfig, downloadFiles);
exports.assets = series(cleanimg, styles, scripts, images);
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.cleanimg = cleanimg;
exports.default = parallel(checkConfig, browsersync, startwatch);
