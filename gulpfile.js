const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('styles', () => {
	return gulp.src('./dev/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1'))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/styles/'))
});

gulp.task('js', () => {
	browserify('dev/scripts/main.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
			presets: ['env', 'react']
		})
		.bundle()
		.on('error',notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in JS'
		}))
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(gulp.dest('./public/scripts/'))
		.pipe(reload({stream:true}));
});

gulp.task('bs', () => {
	browserSync.init({
		server:  {
			basedir: './'
		}
	});
});

gulp.task('watch', () => {
	gulp.watch('./dev/styles/**/*.scss', ['styles']);
	gulp.watch('./dev/scripts/main.js', ['js'])
	gulp.watch('*.html', reload);
});

gulp.task('default', ['bs', 'styles', 'js', 'watch'])