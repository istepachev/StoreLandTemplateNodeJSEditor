import { CURRENT_SITE } from "./constants.js";
import bs from "browser-sync";

const browserSync = bs.create();

function browsersyncTask() {
  browserSync.init({
    notify: false,
    proxy: {
      target: `${CURRENT_SITE}`,
      proxyReq: [
        (proxyReq) => {
          proxyReq.setHeader("x-nodejs-editor-version", "1.01");
        },
      ],
    },
    online: true, // If «false» - Browsersync will work offline without internet connection
    injectChanges: true,
    open: "external",
    port: 8088,
  });
}

export { browsersyncTask, browserSync };
