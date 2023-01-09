import { src, dest } from "../../gulpfile.js";
import path from "node:path";
import plumber from "gulp-plumber";
import replacePath from "gulp-replace-path";
import autoprefixer from "gulp-autoprefixer";
import cleancss from "gulp-clean-css";
import scss from "gulp-dart-sass";
import bulk from "gulp-sass-bulk-importer";
import { Paths, BASE_DIR, preprocessor, preprocessorOn } from "../const.js";
import { checkBuild } from "../utils.js";
// import { browserSync } from "./browsersync.js";

async function styles(_, filePath) {
  const isBuild = checkBuild(filePath);
  const file = filePath;
  const fileName = !isBuild ? path.basename(file) : "";

  if (preprocessorOn) {
    const PATH = !isBuild
      ? `${BASE_DIR}/${preprocessor}/**/*.${preprocessor}`
      : `${BASE_DIR}/${preprocessor}/${fileName}`;
    if (isBuild) {
      src([
        `${BASE_DIR}/${preprocessor}/*.css`,
        `${BASE_DIR}/${preprocessor}/default/**`,
      ])
        .pipe(replacePath(`/src/${preprocessor}/default`, ""))
        .pipe(dest(Paths.buildStatic));
    }
    src(PATH)
      .pipe(bulk())
      .pipe(plumber())
      .pipe(
        scss({
          includePaths: [`${BASE_DIR}/${preprocessor}/templates/`],
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
      .pipe(dest(Paths.buildStatic));
  } else {
    if (isBuild) {
      return src([`${BASE_DIR}/css/**/*.css`])
        .pipe(replacePath(`/src/css/default`, ""))
        .pipe(dest(Paths.buildStatic));
    } else {
      return (
        src(`${BASE_DIR}/css/${fileName}`)
          // .pipe(browserSync.stream())
          // .pipe(browserSync.reload("*.css"))
          // .pipe(browserSync.stream({ match: "**/*.css" }))
          .pipe(dest(Paths.buildStatic))
      );
    }
  }
  isBuild && filePath();
}

export default styles;
