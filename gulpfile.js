// VARIABLES & PATHS
let preprocessor = 'scss', // Preprocessor (sass, scss, less, styl),
	preprocessorOn = false,
    fileswatch   = 'html,htm', // List of files extensions for watching & hard reload (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    baseDir      = 'src', // Base directory path without «/» at the end    
    online       = true, // If «false» - Browsersync will work offline without internet connection
	WAIT_TIME    = 0;  // Время задержки перед обновлением страницы.

let paths = {
	baseDir: 'src',
	distDir: 'dist',
	downloadDir: 'files',
	scripts: {
		src: [
			// 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
			this.baseDir + '/js/main.js' // app.js. Always at the end
		],
		dest: this.distDir,
	},

	styles: {
		src:  (preprocessorOn) ? this.baseDir + '/' + preprocessor + '/main.scss' : this.baseDir+ '/' + 'css' + + '/main.css',				
		dest: this.distDir + '/',
		all: this.baseDir + '/**.css'
	},

	images: {
		src:  this.baseDir + '/images/**/*',
		dest: this.distDir + '/',
	},
	cssOutputName: 'main.css',
	jsOutputName:  'main.js',

}

// LOGIC
const { src, dest, parallel, series, watch } = require('gulp');
const scss         = require('gulp-sass');
const fileinclude = require('gulp-file-include');
const cleancss     = require('gulp-clean-css');
const concat       = require('gulp-concat');
const browserSync  = require('browser-sync').create();
const uglify       = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin     = require('gulp-imagemin');
const newer        = require('gulp-newer');
const del          = require('del');
const wait         = require('gulp-wait');
const plumber      = require('gulp-plumber');

// Dev depend
const fetch = require('node-fetch');
const fs = require("fs");
const { base64encode } = require('nodejs-base64');
const { URLSearchParams } = require('url');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment'); // require

const {CURRENT_SITE} = require('./storeland-uploader-config.json'); // Текущий url адрес сайта, с которым работаем
const SECRET_KEYS = require('./secret-keys.json'); // JSON карта сайтов с секретными ключами
const {SECRET_KEY} = SECRET_KEYS[CURRENT_SITE]; // Секретный ключ текущего сайта

function checkConfig(cb){
	if(!CURRENT_SITE) {
		cb(new Error(`Не задан url адрес ${chalk.red(`CURRENT_SITE`)} в файле ` + chalk.red(`storeland-uploader-config.json`)))
	}
	if(!SECRET_KEY) {
		cb(new Error(`Не задан ${chalk.red(`SECRET_KEY`)} в файле ` + chalk.red(`secret-key.json`)))
	}
	cb()
}
const URL_MAP = {
	save : `${CURRENT_SITE}/api/v1/site_files/save`,
	get_list: `${CURRENT_SITE}/api/v1/site_files/get_list`,
	get_file: `${CURRENT_SITE}/api/v1/site_files/get`
}

function browsersync() {
	browserSync.init({
		notify: false,
		proxy: {
			target: `${CURRENT_SITE}`,     
			proxyReq: [
				function(proxyReq) {
					proxyReq.setHeader('x-nodejs-editor-version', '1.01');            
				}
			] 
		},
		online,
		injectChanges: true,
		open: 'external',
		port: 8088
	})
}

function scripts() {
	return src(paths.scripts.src)
	.pipe(wait(WAIT_TIME))
	.pipe(browserSync.stream())
}

function styles(event = {}) {	
	let {fileName} = event;

	if(preprocessorOn){
		return src(paths.styles.src)
		.pipe(plumber())
		.pipe(eval(preprocessor)({ includePaths : ['./files/scss/templates/'] }))
		// .pipe(concat(paths.cssOutputName))
		// .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		// .pipe(cleancss( {level: { 1: { specialComments: 0 } }, /* format: 'beautify' */ }))
		.pipe(dest(paths.styles.dest))
		// .pipe(wait(1500))
		.pipe(browserSync.stream())
	} else {
		if(fileName){
			return src(`${baseDir}/${fileName}`).pipe(browserSync.stream())
		}else {
			return src(paths.styles.all).pipe(browserSync.stream())
		}
		// .pipe(wait(WAIT_TIME))
		// .pipe(browserSync.stream())
	}
}

function images() {
	return src(paths.images.src)
	.pipe(newer(paths.images.dest))
	.pipe(imagemin())
	.pipe(dest(paths.images.dest))
}

function cleanimg() {
	return del('' + paths.images.dest + '/**/*', { force: true })
}
function htmlinclude(event){
	let file = event;
	// console.log(file);
	let fileName = path.basename(file)
	let fileExt =  path.extname(file);	

	// console.log(event,fileName,  typeof fileName);

	return	src([file])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('./dist'));
	return `./dist/files/${fileName}`;
}

function startwatch() {
	// Стили
	if(preprocessorOn){
		watch(baseDir  + '/**/*.scss', { delay: 100 }, styles);
	}
	watch(baseDir  + '/**/*.css').on('change', function(event){
		uploadFile(event, styles);
		if(!preprocessorOn){
			// styles()
		}		
	})	
	// Изображения
	watch(baseDir  + '/**/*.{' + imageswatch + '}')
	.on('add', function(event){
		uploadFile(event)
	})
	.on('change', function(event){
		uploadFile(event)
	});
	// Html
	watch(baseDir  + '/**/[^_]*.{' + fileswatch + '}').on('change', function(event){		
		htmlinclude(event);
	});
	watch('./dist/files/*.{' + fileswatch + '}').on('change', function(event){		
		uploadFile(event)
	});	
	// Javascript
	watch([baseDir + '/**/*.js']).on('change', function(event){
		uploadFile(event);
		if(!preprocessorOn){
			scripts()
		}
	})
}

function uploadFile(event, cb){
	let file = event;
	let fileName = path.basename(file)
	let fileExt =  path.extname(file);	

	new Promise(resolve => {
		fs.readFile(`${file}`, {encoding: 'utf8'}, (err, data) =>{
			if (err) throw err;			
			const content = base64encode(data);
			resolve(content);
		});

		if(imageswatch.includes(fileExt.replace('.',''))){				
			resolve(Buffer.from(fs.readFileSync(file)).toString('base64'))
		}
	})
	.then((encoded) => {		
		let params = new URLSearchParams();
		params.append('secret_key', SECRET_KEY);
		params.append('form[file_name]', `${fileName}`);
		params.append('form[file_content]', `${encoded}`);
		// if(fileName.includes('css')){
			params.append('form[do_not_receive_file]', `1`);
		// }	
	
		fetch(URL_MAP.save, {
			method: 'post',
			body:    params,
			timeout: 5000,
		})
		.then(res => res.json())
		.then(json=>{
			if(json.status === `ok`){
				console.log(`[${moment().format("HH:mm:ss")}] Файл ${chalk.red(fileName)} успешно отправлен ✔️`);     
				if(!fileName.includes('css')){
					browserSync.reload()
				}
				if(cb){
					cb()
				}
			} else if (json.status == `error`) {
				console.log(`Ошибка отправки ⛔ ${fileName}`); 
				console.log(`${json.message}`);                                        
			}
		}); 
	})
	.catch(err => console.error(err));
}
function downloadFiles(done) {
	const FILES_PATH = `./${paths.downloadDir}`;
	let params = new URLSearchParams();
	params.append('secret_key', SECRET_KEY);

	fetch(URL_MAP.get_list, {
		method: 'post',
		body:    params,
		timeout: 5000,
	})
	.then(res => res.json())
	.then(json => {
		if(json.status === `ok`) {
		  console.log(`Загружен список всех файлов ✔️`);  
		  
		  if (!fs.existsSync(FILES_PATH)){
			  fs.mkdirSync(FILES_PATH);
		  }			
		  const filesArray = json.data.map((item)=>{
			  return {
				file_id: item['file_id']['value'],
				file_name: item['file_name']['value'],
			  }
		  });
		  return filesArray;

		} else if (json.status == `error`) {
		  console.log(`Ошибка загрузки ⛔`);                         
		}
	})
	.then(array =>{
		console.log(`Всего файлов ${array.length}`);
		const arrLength = array.length;
		let count = 1;
		const getFile = (arr) => {
			if(!arr.length){
				console.log(`Всего скачано файлов ${count} из ${arrLength}`)
				done();		
				return;
			}
			const {file_id, file_name} = arr.shift();
			
			let params = new URLSearchParams();
			params.append('secret_key', SECRET_KEY);
			
			fetch(`${URL_MAP.get_file}/${file_id}`, {
				method: 'post',
				body:    params,
				timeout: 5000,
			})
			.then(res => res.json())
			.then(json => {		
				if(json.status === `ok`) {						
					return json;
				}	
			})
			.then(json => {
				fs.writeFile(`${FILES_PATH}/${json['data']['file_name'].value}`, json['data']['file_content'].value, 'base64', function(err) {
					if(err){
						console.log(err);
					}

					console.log(`Скачан файл ${file_name}. Всего ${count} из ${arrLength}`);
					getFile(array);						
					count++;
				});
			})
			.catch(console.log)	

		}
		getFile(array);
	})
}
exports.browsersync = browsersync;
exports.download    = series(checkConfig,downloadFiles);
exports.assets      = series(cleanimg, styles, scripts, images);
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.default     = parallel(checkConfig, styles, scripts, browsersync, startwatch);
