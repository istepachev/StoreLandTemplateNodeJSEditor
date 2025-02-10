import { src } from 'gulp';
import plumber from 'gulp-plumber';

async function htmlTemplate(_, filePath) {
  return src(filePath, { allowEmpty: true }).pipe(plumber());
}

export default htmlTemplate;
