import { src, dest } from 'gulp';
import path from 'node:path';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';
import cleancss from 'gulp-clean-css';
import Config from '../const.js';

const { IS_BUILD, Paths } = Config;

async function styles(_, filePath = '') {
  const fileName = path.basename(filePath);
  const cssPath = `${Paths.styles.src}/${fileName}`;
  const PATH = IS_BUILD ? Paths.styles.build : cssPath;

  return src(PATH)
    .pipe(plumber())
    .pipe(autoprefixer(getAutoprefixerConfig()))
    .pipe(cleancss(getCleanCssConfig()))
    .pipe(dest(Paths.styles.dest));
}

function getAutoprefixerConfig() {
  return {
    grid: true,
    overrideBrowserslist: ['last 3 versions', '> 1%', 'not dead'],
  };
}

function getCleanCssConfig() {
  return {
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
      breakWith: '\n', // controls the new line character, can be `'\r\n'` or `'\n'` (aliased as `'windows'` and `'unix'` or `'crlf'` and `'lf'`); defaults to system one, so former on Windows and latter on Unix
      indentBy: 0, // controls number of characters to indent with; defaults to `0`
      indentWith: 'space', // controls a character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
      spaces: {
        // controls where to insert spaces
        aroundSelectorRelation: true, // controls if spaces come around selector relations; e.g. `div > a`; defaults to `false`
        beforeBlockBegins: true, // controls if a space comes before a block begins; e.g. `.block {`; defaults to `false`
        beforeValue: true, // controls if a space comes before a value; e.g. `width: 1rem`; defaults to `false`
      },
      wrapAt: false, // controls maximum line length; defaults to `false`
    },
  };
}

export default styles;
