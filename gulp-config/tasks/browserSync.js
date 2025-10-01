import bs from 'browser-sync';

const browserSync = bs.create();

function browserSyncTask() {
  browserSync.init({
    notify: false,
    proxy: {
      target: process.env.CURRENT_SITE,
      proxyReq: [
        (proxyReq) => {
          proxyReq.setHeader('x-nodejs-editor-version', '1.01');
        },
      ],
    },
    online: true,
    injectChanges: true,
    open: false,
    port: process.env.PORT,
  });
}

export { browserSyncTask, browserSync };
