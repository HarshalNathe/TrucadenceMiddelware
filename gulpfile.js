/*
Auther : Sanket D Kulkarni
Note : Do not update this file.
*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var inject = require('gulp-inject');
var html2Js = require('gulp-ng-html2js');
// var server = require('gulp-develop-server');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var open = require('gulp-open');
const jscs = require('gulp-jscs');
var plug = require('gulp-load-plugins')({
  lazy: true
});
var yargs = require('yargs').argv;
var gulpIf = require('gulp-if');
var fail = require('gulp-fail');
var streamqueue = require('streamqueue');
var del = require('del');

var paths = {
  scripts: ['public/js/app.js',
    'public/js/appRoutes.js',
    'public/js/appDirectives.js',
    'public/js/routes/**/*.js',
    'public/js/controllers/**/*.js',
    'public/js/directives/**/*.js',
    'public/js/filters/**/*.js',
    'public/js/services/**/*.js',
    'public/js/**/*.js',
    'public/assets/js/**/*.js'
  ],
  styles: ['public/assets/css/less/**/*.less'],
  scss: '',
  css: ['public/assets/css/**/*.css']
};

gulp.task('scripts', ['img'], function () {
  return gulp.src(paths.scripts)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/dist/js'))
    .pipe(connect.reload());
});

gulp.task('img', ['styles'], function () {
  return gulp.src('./public/img/**.*')
    .pipe(gulp.dest('./public/dist/img'));
});

/* This task will compile any less/scss into css, and then concatenate the result with
 * any existing .css and then output it to the build directory
 */
gulp.task('styles', ['ngHtml2Js'], function () {

  return streamqueue({
    objectMode: true
  },
    gulp.src([].concat(paths.css)), // css
    //gulp.src([].concat(paths.scss)).pipe(sass().on('error', sass.logError)), // scss
    gulp.src([].concat(paths.styles)).pipe(less()) // less
  )
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/dist/css'))
    .pipe(connect.reload());
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['wiredep']);

var options = {
  bowerJson: require('./bower.json'),
  directory: './public/libs/',
  //ignorePath: '../..',
  exclude: [
    'public/libs/angular-animate/*.js',
    'public/libs/angular-sanitize/*.js',
    'public/libs/angular-ui-router/release/*.js'
  ]
};

var config = {
  src: './public/',
  js: [
    './public/' + '**/*.module.js',
    './public/' + '**/*.js',
    '!' + './public/libs/' + '**/*.js',
    '!' + './public/' + 'dist/**'
  ]
}

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', ['scripts'], function () {

  var wiredep = require('wiredep').stream;

  return gulp
    .src('public/index.html')
    .pipe(wiredep(options))
    .pipe(inject(gulp.src(config.js)))
    .pipe(gulp.dest(config.src));
});

gulp.task('ngHtml2Js', ['vet-dev'], function () {
  gulp.src('./public/js/**/*.html')
    .pipe(html2Js({
      moduleName: 'html-templates'
    }))
    .pipe(concat('html-templates.js'))
    .pipe(gulp.dest('./public/dist/'));
});

gulp.task('vet-dev', ['clean'], function () {

  return gulp
    .src(['./public/js/' + '**/*.js'])
    .pipe(plug.jshint()).on('error', errorHandler)
    .pipe(plug.jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe(jscs()).on('error', errorHandler)
    .pipe(_printVerbose());
});

gulp.task('vet-prod', function () {

  return gulp
    .src(['./public/js/' + '**/*.js'])
    .pipe(_handleErrors())
    .pipe(_printVerbose())
    .pipe(plug.jshint()).on('error', errorHandler)
    .pipe(plug.jshint.reporter('jshint-stylish', {
      verbose: true
    }))
    .pipe(plug.if(yargs.fail, plug.jshint.reporter('fail')))
    .pipe(plug.jscs())
    .pipe(gulpIf(function (file) {
      return ((file.jscs && !file.jscs.success) || (file.jshint && !file.jshint.success));
    }, fail(function () {
      process.exit(1);
      return 'vet finished with errors!';
    }, true)));
});

function errorHandler(error) {
  //return ((file.jscs && !file.jscs.success) || (file.jshint && !file.jshint.success));
  console.log(error);
  this.emit('end');
}

function _handleErrors() {
  return plug.if(true, plug.plumber(onError));

  function onError(error) {
    console.log('onError');
    plug.util.log(
      plug.util.colors.cyan('Plumber') + plug.util.colors.red(' found unhandled error:\n'),
      error.toString());
    // This line of code solves the watcher crashing on some errors.
    this.emit('end');
  }
}

function _printVerbose() {
  return plug.if(yargs.verbose, plug.print());
}

gulp.task('watch', [], function () {
  gulp.watch('./public/assets/*.*', ['styles']);
  gulp.watch('./public/js/**/*.*', ['scripts']);
  gulp.watch('./public/*.*', ['scripts']);
});

// gulp.task('server:restart', ['wiredep'],function () {
//     return server.restart;
// });

// gulp.task('server:start', ['wiredep'],function () {
//     server.listen({
//         path: './server.js'
//     });
// });

gulp.task('server:watch', ['wiredep'], function () {
  connect.server({
    port: 443,
    host: 'localhost',
    livereload: true,
    root: ['public/', 'public']
  });

  //gulp.run('livereload');
  gulp.run('watch');
  gulp.run('browser');
});

gulp.task('browser', function () {
  gulp.src('./public/index.html')
    .pipe(open({
      uri: 'https://localhost:443'
    }));
});

gulp.task('livereload', ['wiredep'], function () {
  console.log('live reload>>>>>>>>>>>>>>>>>>');
  connect.reload();
});

gulp.task('clean', [], function (cb) {
  return del([
    // Everything inside the dist folder
    'public/dist/**/*'
  ], cb);
});