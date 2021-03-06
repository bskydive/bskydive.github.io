'use strict';

/**
 * Настройки простой системы сборки для небольших проектов
 * Файл богато прокомментирован для облегчения изучения и рефакторинга
 *
 * TODO переписать для gulp@4 и node@12
 *  https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-tasks-in-series.md
 * 
 *
 * Использование:
 * ! установить node@10
 * скопировать в папку с проектом
 * path***Src - пути к исходникам
 * path***Watch - пути к исходникам за которыми надо наблюдать. Надо наблюдать за всеми, но собирать только импортирующие других файлы.
 * path***Clean - что чистить перед пересборкой
 * path***Dest - куда пересобирать
 * отредактировать секцию =CONFIG=
 * установить зависимости из package.json
 * npm run w
 * http://127.0.0.1:8080
 * второй вариант не запускает режим наблюдения(watch):
 * npm run prod
 *
 * Возможности:
 * оптимизация изображений imagemin
 * пересборка при режиме наблюдения(watch)
 * умная очистка каталога сборки при режиме наблюдения(watch)
 * конвертация и умное объединение через include шаблонов pug в html с удалением комментариев
 * конвертация и объединение стилей stylus
 * конвертация markdown в html для документации
 * копирование в папку сборки шрифтов
 * копирование в папку сборки с удалением комментариев скриптов js
 * запуск веб-сервера после сборки
 * Настраиваемая через переменные конфигурация расположения файлов
 *
 * Ограничения:
 * js не сшиваются в один, т.к. для этого необходим webpack(разрешение зависимостей)
 * в режиме наблюдения не пересобирается при добавлении новых файлов
 */

'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const sync = require('gulp-sync')(gulp);
const replace = require('gulp-replace');
//const less = require('gulp-less');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const strip = require('gulp-strip-comments');
const markdown = require('gulp-markdown');
const markdownit = require('gulp-markdown-it');
const rename = require('gulp-rename');
const exec = require('gulp-exec');

/*================================================CONFIG===================================================*/

/**
 * Для вывода в консоль из команд gulp
 */
var reportOptions = {
	err: true, // default = true, false means don't write err
	stderr: true, // default = true, false means don't write stderr
	stdout: true // default = true, false means don't write stdout
};

//для хостинга с особенностями нужен длинный префикс
const staticPath = 'public/portfolio';
// сайт имеет статические подсайты, потому корень выше папки сборки
const webServePath = 'public';
//репозитории
const gitRemoteMain = 'gl';
const gitremoteReserve = 'bb';

//путь во все подпапки заставляет галп делать подпапки на выходе /**/ поэтому надо вписывать все названия файлов
const pathImgSrc = [`src/img/*`]; //['src/img/*.png', 'src/img/*.jpg', 'src/img/*.gif', 'src/img/*.jpeg']
const pathImgClean = [`${staticPath}/img/*`];
const pathImgDest = `./${staticPath}/img`;

const pathJsClean = [`${staticPath}/js/*`];
const pathJsSrc = [`src/js/*.js`, `src/app/timer/timer.js`, `src/app/portfolio/portfolio.js`, `src/app/quotes/quotes.js`, `src/app/weather/weather.js`];
const pathJsDest = `./${staticPath}/js`;

//отдельный css для уже скомпилированных вендорных. Могут конфликтовать между собой в пространстве имён
const pathStylusSrcWatch = [`src/fonts/**/*.styl`, `src/app/**/*.styl`, `src/styles/**/*.styl`];
const pathStylusSrc = [`src/fonts/**/*.styl`, `src/app/**/*.styl`, `src/styles/**/*.styl`];
const pathCssClean = [`${staticPath}/css/*`];
const pathCssSrc = [`src/styles/**/*.css`];
const pathCssDest = `./${staticPath}/css`;

const pathFontsClean = [`${staticPath}/fonts/*`];
const pathFontsSrc = [`src/fonts/**/*.ttf`, `src/fonts/**/*.woff`, `src/fonts/**/*.eot`, `src/fonts/**/*.woff2`, `src/fonts/**/*.svg`, `src/fonts/**/*.otf`];
const pathFontsDest = `./${staticPath}/fonts`;

const pathSoundsClean = [`${staticPath}/sounds/*`];
const pathSoundsSrc = [`src/sounds/*`];
const pathSoundsDest = `./${staticPath}/sounds`;

const pathHtmlClean = [`${staticPath}/*.html`];
const pathPugSrcWatch = [`src/app/portfolio/**/*.pug`];
const pathPugSrc = [`src/app/timer/timer.pug`, `src/app/portfolio/portfolio.pug`, `src/app/quotes/quotes.pug`, `src/app/weather/weather.pug`];
const pathHtmlDest = `./${staticPath}`;

const pathTxtClean = [`${staticPath}/txt/*`];
const pathTxtSrc = [`src/app/portfolio/*.md`, `src/app/quotes/*.md`, `src/app/weather/*.md`, `src/app/timer/*.md`, `src/app/conventions/**/*.md`];
const pathTxtDest = `./${staticPath}/txt`;

/*================================================ERROR====================================================*/
function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

/*================================================IMAGEMIN=================================================*/
gulp.task('img', ['clean-img'], function () {
	return gulp.src(pathImgSrc)
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5,
			svgoPlugins: [{
				removeViewBox: true
			}]
		}).on('error', handleError))
		.pipe(gulp.dest(pathImgDest));
});

/*================================================CLEAN====================================================*/
gulp.task('clean', ['clean-dev', 'clean-img']);

gulp.task('clean-dev', ['clean-font', 'clean-sounds', 'clean-css', 'clean-txt', 'clean-js', 'clean-html']);

gulp.task('clean-font', function () {
	return gulp.src(pathFontsClean, {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-sounds', function () {
	return gulp.src(pathSoundsClean, {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-css', function () {
	return gulp.src(pathCssClean, {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-txt', function () {
	return gulp.src(pathTxtClean, {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-js', function () {
	return gulp.src(pathJsClean, {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-html', function () {
	return gulp.src(pathHtmlClean, {
			read: false
		})
		.pipe(clean());
});

gulp.task('clean-img', function () {
	return gulp.src(pathImgClean, {
			read: false
		})
		.pipe(clean());
});

/*================================================JS=======================================================*/
gulp.task('js', ['clean-js'], function () {
	return gulp.src(pathJsSrc)
		.pipe(strip())
		.pipe(gulp.dest(pathJsDest));
});

///*================================================LESS=====================================================*/
//gulp.task('less', ['clean-css','css'], function () {
//	return gulp.src(['src/less/*.less', 'src/less/**/*.less', 'src/fonts/**/*.less'])
//			.pipe(less({
//				compress: false
//			}))
//			.pipe(concat('portfolio.css').on('error', handleError))
//			//			.pipe(strip())
//			.pipe(gulp.dest('./static/css'));
//});
//
//gulp.task('css', function () {
//	return gulp.src('src/css/*.css')
//			//			.pipe(strip())
//			.pipe(gulp.dest('./static/css'));
//});

/*================================================VERSION=================================================*/
/**
 * Записываем версию предыдущего коммита в шапку сайта
 * Добавляем для напоминания префикс DEV:
 * */
gulp.task('version-dev', function () {
	return gulp.src(pathHtmlDest)
		// .pipe(exec("git log -1 --format='DEV: %cd #%h' --date=format:'%a %d.%m.%Y %H.%M.%S' > version.txt", {continueOnError: true}));
		.pipe(exec("cd " + pathHtmlDest + ";git log -1 --format='DEV: %cd #%h' --date=format:'%c' > version.txt", {
			continueOnError: true
		}))
		.pipe(exec("cd " + pathHtmlDest + ";echo \"sed 's/version-template/`cat version.txt`/' portfolio.html > portfolio.html.sed; mv portfolio.html.sed portfolio.html\" | bash", {
			continueOnError: true
		}))
		.pipe(exec("cd " + pathHtmlDest + ";grep -E 'DEV:|version' portfolio.html", {
			continueOnError: true
		}))
		.pipe(exec.reporter(reportOptions))
});

/**
 * Записываем версию предыдущего коммита в шапку сайта
 * поэтому коммитим два раза, чтобы собрать в portfolio.html текущую версию commit
 * пишем напоминалку-чеклист для тестирования
 * https://github.com/robrich/gulp-exec
 */
gulp.task('version-prod', function (done) {
	console.log('Build done', '\n\nЧеклист: \n * npm run web-start или npm run w,\n * anchor-offset, \n * ссылки skills/nav/contacts/kb, \n * открыть на мобилке, \n * npm run web-stop, \n * npm run prod, \n * g cm "msg", \n * сделать PR на bitbucket,\n');

	return gulp.src(pathHtmlDest)
		//.pipe(exec("git log -1 --format='%cd #%h' --date=format:'%a %d.%m.%Y %H.%M.%S' > version.txt", { continueOnError: true }));
		//сохраняем если что-то забыли
		// .pipe(exec("git commit -am 'commit-prod'", { continueOnError: true }))
		// .pipe(exec.reporter(reportOptions))
		//пишем версию коммита
		.pipe(exec("cd " + pathHtmlDest + ";git log -1 --format='%cd #%h' --date=format:'%c' > version.txt", {
			continueOnError: true
		}))
		.pipe(exec.reporter(reportOptions))
		//читаем версию коммита и пишем в portfolio.html
		.pipe(exec("cd " + pathHtmlDest + ";echo \"sed 's/version-template/`cat version.txt`/' portfolio.html > portfolio.html.sed; mv portfolio.html.sed portfolio.html\" | bash", {
			continueOnError: true
		}))
		.pipe(exec.reporter(reportOptions))
		//выводим в консоль то что записали
		.pipe(exec("cd " + pathHtmlDest + ";grep -E 'DEV:|version' portfolio.html", {
			continueOnError: true
		}))
		.pipe(exec.reporter(reportOptions))
		//отправляем на сервер в develop
		.pipe(exec(`git commit -am 'commit-version';git push ${gitRemoteMain} develop;git push ${gitremoteReserve} develop`, {
			continueOnError: true
		}))
		.pipe(exec.reporter(reportOptions));
	// done();
});

/*================================================WEBSERVER================================================*/
///**
// * Останавливает и запускает веб-сервер с автоматическим рестартом
// * Для смены каталога запуска веб-сервера необходимо удалить сервис
// * */
//	'cd ./',
//	'pm2 stop http-server',
//	'pm2 delete http-server',
//	'pm2 start http-server -- -c-1 -a localhost -p 8080 ./public/portfolio',
//	'pm2 info http-server'

gulp.task('web-stop', function () {
	return gulp.src(webServePath)
		.pipe(exec('bash web-stop.sh', {
			continueOnError: true
		}))
		// .pipe(exec.reporter(reportOptions));
});

gulp.task('web-start', ['web-stop'], function () {
	// console.log('http://localhost:8080/portfolio.html')
	return gulp.src(webServePath)
		.pipe(exec('bash web-start.sh ' + webServePath, {
			continueOnError: true
		}))
		.pipe(exec.reporter(reportOptions));
});

/*================================================STYLUS===================================================*/
gulp.task('stylus', ['clean-css', 'css'], function () {
	return gulp.src(pathStylusSrc)
		.pipe(stylus())
		.pipe(concat('portfolio.css').on('error', handleError))
		//			.pipe(strip())
		.pipe(gulp.dest(pathCssDest));
});

gulp.task('css', function () {
	return gulp.src(pathCssSrc)
		//			.pipe(strip())
		.pipe(gulp.dest(pathCssDest));
});

/*================================================PREFIX===================================================*/
//gulp.task('prefix', function () {
//	var postcss      = require('gulp-postcss');
//	var sourcemaps   = require('gulp-sourcemaps');
//	var autoprefixer = require('autoprefixer');
//
//	return gulp.src('./public/styles/*.css')
//			.pipe(sourcemaps.init())
//			.pipe(postcss([ autoprefixer() ]))
//			.pipe(sourcemaps.write('.'))
//			.pipe(gulp.dest('./public/styles/autoprefixer'));

/*================================================FONTS====================================================*/
gulp.task('fonts', ['clean-font'], function () {
	return gulp.src(pathFontsSrc)
		.pipe(gulp.dest(pathFontsDest));
});

/*================================================SOUND====================================================*/
gulp.task('sounds', ['clean-sounds'], function () {
	return gulp.src(pathSoundsSrc)
		.pipe(gulp.dest(pathSoundsDest));
});

/*================================================PUG======================================================*/
gulp.task(
	'pug',
	['clean-html'],
	function () {
		return gulp.src(pathPugSrc)
			.pipe(pug({
				pretty: true
			}).on('error', handleError))
			.pipe(strip())
			.pipe(gulp.dest(pathHtmlDest));
	});

/*================================================TXT======================================================*/
//todo вынуть костыли-переменные и сделать файл-шаблон с размножением

const replaceTextHeader = '<html lang="ru">\n' +
	'  <head>\n' +
	'    <meta charset="UTF-8"/>\n' +
	'    <meta http-equiv="x-ua-compatible" content="ie=edge"/>\n' +
	'    <meta name="robots" content="all"/>\n' +
	'    <meta name="viewport" content="width=device-width, initial-scale=1"/>\n' +
	'  </head>\n' +
	'  <body>';

const replaceTextFooter = '  </body>\n' +
	'</html>';

gulp.task('txt', ['clean-txt'], function () {
	return gulp.src(pathTxtSrc)
		.pipe(markdown())
		// .pipe(replace('HEADER_TEMPLATE', replaceTextHeader))
		// .pipe(replace('FOOTER_TEMPLATE', replaceTextFooter))
		.pipe(rename({
			extname: '.md.html'
		}))
		.pipe(gulp.dest(pathTxtDest));
});

/*================================================WATCH====================================================*/

/**
 * Всё, кроме звуков и картинок
 */
gulp.task('w', ['dev', 'web-start'], function () {

	gulp.watch(pathStylusSrcWatch.concat(pathCssSrc),
		['stylus']);

	gulp.watch(pathPugSrcWatch,
		['pug']);

	gulp.watch(pathTxtSrc,
		['txt']);

	gulp.watch(pathJsSrc,
		['js']);

	gulp.watch(pathFontsSrc,
		['fonts']);

	//	gulp.watch(pathImgSrc,
	//			['img']);
});

/*================================================RUNNER===================================================*/

/**
 * Для асинхронности все задания содержат внутри очистку
 * При синхронном выполнении можно запускать вначале clean-dev или clean
 */
gulp.task('dev', sync.sync(['fonts', 'js', 'css', 'stylus', 'pug', 'txt', 'version-dev']));

/**
 * Выполняется синхронно, чтобы сделать коммит
 * Нельзя перемешивать version
 */
gulp.task('prod', sync.sync(['web-stop', 'fonts', 'js', 'css', 'stylus', 'pug', 'txt', 'sounds', 'img', 'version-prod']));
