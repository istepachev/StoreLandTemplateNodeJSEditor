import Config from "../const.js";
const { CURRENT_SITE } = Config;
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
    open: false,
    port: 3003,
  });
}

export { browserSyncTask, browserSync };
