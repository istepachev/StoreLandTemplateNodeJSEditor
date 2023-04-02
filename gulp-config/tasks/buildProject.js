import { src, dest } from "../../gulpfile.js";
import { deleteSync } from "del";
import { DEFAULT_FOLDER_NAME, Paths, STATIC_DIR } from "../const.js";

async function buildProject() {
  const htmlFilesToMove = [
    `${Paths.html.dest}/client/**/*.*`,
    `${Paths.html.dest}/discount/**/*.*`,
  ];
  const streamHtml = src(htmlFilesToMove).pipe(dest(`${Paths.html.dest}`));
  streamHtml.on("end", () => {
    deleteSync([`${Paths.html.dest}/client/`, `${Paths.html.dest}/discount/`]);
  });

  const staticFilesToMove = [`${STATIC_DIR}/${DEFAULT_FOLDER_NAME}/**/*.*`];
  const streamStatic = src(staticFilesToMove).pipe(dest(STATIC_DIR));
  streamStatic.on("end", () => {
    deleteSync(`${STATIC_DIR}/${DEFAULT_FOLDER_NAME}`);
  });
}

export default buildProject;
