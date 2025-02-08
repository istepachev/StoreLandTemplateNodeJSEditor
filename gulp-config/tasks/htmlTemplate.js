async function htmlTemplate(_, filePath = Paths.htmlTemplate.default) {
  return src(filePath, { allowEmpty: true })
    .pipe(plumber())
    .pipe(fileInclude(fileIncludeConfig))
    .pipe(dest(Paths.htm.dest));
}

export default htmlTemplate;
