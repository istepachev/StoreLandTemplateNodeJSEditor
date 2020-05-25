// VARIABLES & PATHS
let preprocessor = 'scss', // Preprocessor (sass, scss, less, styl),
	preprocessorOn = false,
    fileswatch   = 'html,htm', // List of files extensions for watching & hard reload (comma separated)
    imageswatch  = 'jpg,jpeg,png,webp,svg', // List of images extensions for watching & compression (comma separated)
    baseDir      = 'files', // Base directory path without «/» at the end
    online       = true, // If «false» - Browsersync will work offline without internet connection
	WAIT_TIME    = 500;  // Время задержки перед обновлением страницы.

let paths = {

	scripts: {
		src: [
			// 'node_modules/jquery/dist/jquery.min.js', // npm vendor example (npm i --save-dev jquery)
			baseDir + '/main.js' // app.js. Always at the end
		],
		dest: baseDir + '/js',
	},

	styles: {
		src:  (preprocessorOn) ? baseDir + '/' + preprocessor + '/main.scss' : baseDir + '/main.css',				
		dest: baseDir + '/',
	},

	images: {
		src:  baseDir + '/images/src/**/*',
		dest: baseDir + '/images/dest',
	},
	cssOutputName: 'main.css',
	jsOutputName:  'main.js',

}

// LOGIC

const { src, dest, parallel, series, watch } = require('gulp');
const sass         = require('gulp-sass');
const scss         = require('gulp-sass');
const less         = require('gulp-less');
const styl         = require('gulp-stylus');
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
const { base64encode, base64decode } = require('nodejs-base64');
const { URLSearchParams } = require('url');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment'); // require
const notifier = require('node-notifier');
const uuidv4 = require('uuid/v4'); // <== NOW DEPRECATED!
uuidv4();

const {SECRET_KEY, SITE} = require('./storeland-uploader-config.json');

function checkConfig(cb){
	if(!SECRET_KEY) {
		notifier.notify({
			message: `Не задан SECRET_KEY в файле storeland-uploader-config.json`,
			type: 'info'
		});
		cb(new Error(`Не задан ${chalk.red(`SECRET_KEY`)} в файле ` + chalk.red(`storeland-uploader-config.json`)))
	}
	if(!SITE) {
		notifier.notify({
			message: `Не задан url адрес SITE в файле storeland-uploader-config.json`,
			type: 'info'
		});
		cb(new Error(`Не задан url адрес ${chalk.red(`SITE`)} в файле ` + chalk.red(`storeland-uploader-config.json`)))
	}
}
const href = `${SITE}/api/v1/site_files/save`;

function browsersync() {
	browserSync.init({
		notify: false,
		proxy: {
			target: `${SITE}`,     
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

function styles() {
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
		return src(paths.styles.src)
		.pipe(wait(WAIT_TIME))
		.pipe(browserSync.stream())
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


function startwatch() {
	if(preprocessorOn){
		watch(baseDir  + '/**/*.scss', { delay: 100 }, styles);
	}
	watch(baseDir  + '/**/*.css').on('change', function(event){
		uploadFile(event);	
	})	
	watch(baseDir  + '/**/*.{' + imageswatch + '}')
	.on('add', function(event){
		uploadFile(event)
	})
	.on('change', function(event){
		uploadFile(event)
	});
	watch(baseDir  + '/**/*.{' + fileswatch + '}').on('change', function(event){
		uploadFile(event)
	});
	watch([baseDir + '/**/*.js']).on('change', function(event){
		uploadFile(event);
	})
}

function uploadFile(event){
	let file = event;
	let fileName = path.basename(file)
	let fileExt =  path.extname(file);	

	new Promise(resolve => {
		fs.readFile(`${file}`, {encoding: 'utf8'}, (err, data) =>{
			if (err) throw err;
			resolve(base64encode(data));
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
	
		fetch(href, {
			method: 'post',
			body:    params,
			timeout: 5000,
		})
		.then(res => res.json())
		.then(json=>{
			if(json.status === `ok`){
				console.log(`[${moment().format("HH:mm:ss")}] Файл ${chalk.red(fileName)} успешно отправлен ✔️`); 
				setTimeout(() => {
					browserSync.reload()
				}, WAIT_TIME);
			} else if (json.status == `error`) {
				console.log(`Ошибка отправки ⛔ ${fileName}`); 
				console.log(`${json.message}`);                                        
			}
		}); 
	})
	.catch(err => console.error(err));
}
function download(done) {
	const FILES_PATH = './files';
	let params = new URLSearchParams();
	params.append('secret_key', SECRET_KEY);

	fetch(`${SITE}/api/v1/site_files/get_list`, {
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
				return;
			}
			const {file_id, file_name} = arr.shift();
			
			let params = new URLSearchParams();
			params.append('secret_key', SECRET_KEY);
			
			fetch(`${SITE}/api/v1/site_files/get/${file_id}`, {
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
				fs.writeFileSync(`${FILES_PATH}/${json['data']['file_name'].value}`, json['data']['file_content'].value, 'base64', function(err) {
					if(err){
						console.log(err);
					}
				});
			})
			.then(()=>{
				console.log(`Скачан файл ${file_name}. Итого ${count} из ${arrLength}`);
				
				setTimeout(() => {
					getFile(array);						
					count++
				}, 500);
			})
			.catch(console.log)	

		}
		getFile(array);
	})
	done()
}
exports.browsersync = browsersync;
exports.assets      = series(cleanimg, styles, scripts, images);
exports.download     = download;
exports.styles      = styles;
exports.scripts     = scripts;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.default     = parallel(checkConfig, styles, scripts, browsersync, startwatch);
