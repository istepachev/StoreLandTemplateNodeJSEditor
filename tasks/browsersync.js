const { CURRENT_SITE } = require("./constants");
const browserSync = require("browser-sync").create();

function browsersync() {
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

module.exports = browsersync;
