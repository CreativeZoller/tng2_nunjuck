'use strict';
var gulp    = require('gulp'),
    plugins = require('gulp-load-plugins')({
        DEBUG: false,
        scope: 'devDependencies',
        camelize: true,
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    taskPath    = './gulptasks/',
    gConfig     = require('./gulptasks/gulp-config'),
    fs          = require('fs'),
    runSequence = require('run-sequence'),
    moment      = require('moment'),
    tz          = require('moment-timezone');

require(taskPath + 'clean')(gulp, gConfig, plugins);

function changeEvent(evt) {
	plugins.gulpUtil.log('File', plugins.gulpUtil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/./)/'), '')), 'was', plugins.gulpUtil.colors.magenta(evt.type));
}
var manageEnvironment = function(environment) {
  environment.addFilter('slug', function(str) {
    return str && str.replace(/\s/g, '-', str).toLowerCase();
  }); // pl {{ 'My important post'|slug }} >> my-important-post
  moment.locale('hu');
  var time = moment().format('LLL').toString();
  var year = moment().format('YYYY').toString();
  environment.addGlobal('compileYear', year);
  environment.addGlobal('compileTime', time);
}


gulp.task('nunjucks:generate', function() {
	plugins.nunjucksRender.nunjucks.configure('./src/nunjucks/templates/');
	return gulp.src('./src/nunjucks/pages/**/*.+(html|nunjucks)')
		.pipe(plugins.data(function() {
			return JSON.parse(fs.readFileSync('./src/nunjucks/data.json','utf8'))
		}))
		.pipe(plugins.nunjucksRender({
      manageEnv: manageEnvironment
    }))
		.on('error', function(err) {
			plugins.notify.onError({ title: 'nunjucks error!', message: '<%= error.message %>', sound: 'Frog' })(err);
			this.emit('end');
		})
		.pipe(gulp.dest('.tmp/_sites/'));
});
gulp.task('html:lint', function() {
	return gulp.src('.tmp/_sites/**/*.html')
		.pipe(plugins.htmlhint('.htmlhintrc'))
		.on('error', function(err) {
			notify.onError({ title: 'Html error!', message: '<%= error.message %>', sound: 'Frog' })(err);
			this.emit('end');
		})
		.pipe(plugins.htmlhint.reporter("htmlhint-stylish")) ;
});
gulp.task('html:minify', function() {
	return gulp.src('.tmp/_sites/**/*.html')
		.pipe(plugins.htmlmin({
			removeComments: true,
			removeCommentsFromCDATA: true,
			removeCDATASectionsFromCDATA: true,
			collapseWhitespace: true,
			collapseInlineTagWhitespace: true,
			conservativeCollapse: true,
      keepClosingSlash: true,
			preserveLineBreaks: true,
      removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true
		}))
		.on('error', function(err) {
			notify.onError({ title: 'Minify error!', message: '<%= error.message %>', sound: 'Frog' })(err);
			this.emit('end');
		})
		.pipe(gulp.dest('./_dist'));
});
