'use strict';
var gulp    = require('gulp'),
    plugins = require('gulp-load-plugins')({
        DEBUG: false,
        scope: 'devDependencies',
        camelize: true,
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    }),
    taskPath = './gulptasks/',
    // gConfig = require('./gulptasks/gulp-config'),
    runSequence = require('run-sequence');

function changeEvent(evt) {
	gulpUtil.log('File', gulpUtil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/./)/'), '')), 'was', gulpUtil.colors.magenta(evt.type));
}

//TODO: sort them by function to files (eg: generating, linting, fixing, releasing)
gulp.task('nunjucks', function() {
	plugins.nunjucksRender.nunjucks.configure('./src/nunjucks/templates/');
	return gulp.src('./src/nunjucks/pages/**/*.+(html|nunjucks)')
		.pipe(plugins.data(function() {
			return JSON.parse(plugins.fs.readFileSync('./src/nunjucks/data.json','utf8'))
		}))
		.pipe(plugins.nunjucksRender())
		.on('error', function(err) {
			plugins.notify.onError({ title: 'nunjucks error!', message: '<%= error.message %>', sound: 'Frog' })(err);
			this.emit('end');
		})
		.pipe(gulp.dest('./_sites/'));
});
