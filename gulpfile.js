// generic tools
var _ = require('underscore');
var del = require('del');
var concat = require('gulp-concat');
var gulpIf = require('gulp-if');
var jscs = require('gulp-jscs');
var sass = require('gulp-sass');
var size = require('gulp-size');
var autoprefixer = require('gulp-autoprefixer');
var useref = require('gulp-useref');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var runSequence = require('run-sequence');
var notifier = require('node-notifier');
var gutil = require('gulp-util');
var assign = require('lodash.assign');

// gulp and gulp plugins
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');

// CONFIGS
var env = process.env.NODE_ENV || 'development';
var isProd = env === 'production';

var paths = {};
paths.jsDir = './app/scripts';
paths.jsFiles = paths.jsDir + '/**/*.js';
paths.jsEntry = paths.jsDir + '/application.js';
paths.jsOut = 'bundle.js';

paths.scssDir = './app/styles';
// paths.css = './app/styles/**/*';
paths.scssFiles = paths.scssDir + '/**/*.scss';
paths.scssEntry = paths.scssDir + '/main.scss';
paths.cssOut = 'style.css';

paths.html = './app/index.html';
paths.buildDir = isProd ? './dist' : './public';
paths.cssBuildDir = './public/styles';
paths.script = '/scripts';

paths.imgSrc = 'app/images/**/*';
paths.imgDst = 'public/images/';

// MAIN TASKS
gulp.task('default', ['build']);
/**
 * run task in sequence:
 * clear public folder then check style and only then build app
 */
gulp.task('build', function() {
  runSequence(
    'cleanBuildFolder',
    //'scriptsStyleguideFull',
    ['buildHtml', 'buildStyles', 'buildScripts', 'buildEditor', 'buildFonts', 'images'],
    notifySuccess);
});

/**
  * start web server and watchers to recompile on file changes
  */
gulp.task('serve', ['startDevServer', 'browserifyWatch', 'appWatch']);

// SUB TASKS
gulp.task('cleanBuildFolder', function() {
  del(paths.buildDir);
});

gulp.task('appWatch', function() {
  gulp.watch(paths.scssFiles, ['buildStyles']);
  gulp.watch(paths.html, ['buildHtml']);
  gulp.watch(paths.imgSrc, ['images']);
});

gulp.task('startDevServer', function() {
  gulp.src(paths.buildDir)
    .pipe(webserver({
      port: 3000,
      livereload: true
    }));
});

// CSS
  gulp.task('buildStyles', function() {
  return gulp.src(paths.scssFiles)
    .pipe(gulpIf(!isProd, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['> 5%', 'last 2 versions']}))
    .pipe(concat(paths.cssOut))
    .pipe(gulpIf(!isProd, sourcemaps.write()))
    //.pipe(gulpIf(isProd, minifycss()))
    .pipe(gulp.dest(paths.cssBuildDir));
  });

// code healthiness

/**
  * only JSCS
  * should not take much time to run
  * use in watcher
  */
gulp.task('scriptsStyleguideBrief', function() {
  return gulp.src(paths.jsFiles).pipe(jscs());
});

/**
  * both JSCS and ESLINT
  * use in builds
  */

/**
  * gulp.task('scriptsStyleguideFull', function() {
  *  return gulp.src(paths.jsFiles)
  *  .pipe(jscs())
  *  .pipe(eslint())
  *  .pipe(eslint.format())
  *  .pipe(eslint.failOnError());
  * });
  */

/**
  * HTML
  * note - for now just copies html,
  * in future will be used to change content of html
  */
gulp.task('buildHtml', function() {
  return gulp.src(paths.html)
    .pipe(useref())
    .pipe(gulp.dest(paths.buildDir))
    .pipe(size());
});
gulp.task('images', function() {
    gulp.src(paths.imgSrc)
        .pipe(gulp.dest(paths.imgDst));
});
gulp.task('buildEditor', function(){
  return gulp.src('app/scripts/assets/ckeditor/**/*')
      .pipe(gulp.dest(paths.buildDir + '/scripts/assets/ckeditor'));
});
gulp.task('buildFonts', function(){
    return gulp.src('app/styles/fonts/**/*')
      .pipe(gulp.dest(paths.buildDir + '/styles/fonts'));
})

// BROWSERIFY
var browserifyOptions = {
  entries: [paths.jsEntry],
  debug: !isProd,
  fullPaths: true
};

var bundler = browserify(browserifyOptions);

var watchifyOptions = assign({}, watchify.args, browserifyOptions);
var watchBundler = watchify(browserify(watchifyOptions));

gulp.task('buildScripts', function() {
  return bundler.bundle()
    .pipe(source(paths.jsOut))
    .pipe(gulp.dest(paths.buildDir + paths.script));
});

gulp.task('browserifyWatch', function() {
  watchBundler.on('update', watchifyBundle);
  watchBundler.on('log', gutil.log); // output build logs to terminal
  return watchBundler.bundle(); // needed too keep process running
});

// TODO : exit process somehow
function watchifyBundle() {
  return watchBundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(paths.jsOut))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    .pipe(gulp.dest(paths.buildDir + paths.script));
}

// BROWSERIFY EVENTS
bundler.on('error', gutil.log.bind(gutil, 'Browserify Error'));

watchBundler.on('time', function(time) {
  gutil.log('Browserify rebundle finished after ' + gutil.colors.magenta(time + ' ms'));
});


/**
  * small desktop popup with result of a build
  */
function notifySuccess(err) {
  notifier.notify({
    title: 'GULP BUILD ' + (err ? 'FAILED' : 'SUCCESS'),
    message: err ? 'at ' + err.message : '✔ ' + env
  });
}

