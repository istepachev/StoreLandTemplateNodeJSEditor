import { CURRENT_SITE } from "../const.js";
import bs from "browser-sync";

const browserSync = bs.create();

function browserSyncTask() {
  browserSync.init({
    notify: false,
    proxy: {
      target: CURRENT_SITE,
      proxyReq: [
        (proxyReq) => {
          proxyReq.setHeader("x-nodejs-editor-version", "1.01");
        },
      ],
    },
    online: true, // If «false» - Browser-sync will work offline without internet connection
    injectChanges: true,
    open: "external",
    port: 8088,
  });
}

export { browserSyncTask, browserSync };
