(() => {

  'use strict';

  /*
  npm install --save-dev gulp gulp-noop gulp-sass gulp-sass-glob gulp-sourcemaps gulp-plumber gulp-pleeease gulp-wait gulp-notify gulp-concat gulp-uglify browser-sync browsersync-ssi del gulp-html-ssi gulp-imagemin cross-env
  */

  /*
  "scripts": {
      "build": "cross-env NODE_ENV=production gulp build"
  } */

  // development or production
  const devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() === 'development');

  // Gulp module imports
  const { src, dest, watch, series, parallel } = require('gulp'),
    noop = require("gulp-noop"),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps = devBuild ? require('gulp-sourcemaps') : null,
    plumber = require('gulp-plumber'),
    pleeease = require('gulp-pleeease'),
    wait = require('gulp-wait'),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    browserSync = devBuild ? require('browser-sync').create() : null,
    ssi = require('browsersync-ssi'),
    connect = require('gulp-connect-php'),
    del = require('del'),
    includer = require('gulp-html-ssi'),
    imagemin = require('gulp-imagemin');

  console.log('Gulp', devBuild ? 'development' : 'production', 'build');

  // Build Directories
  const dirs = {
    src: './_src',
    dest: './_html'
  };


  // File Sources
  const sources = {
    html: `${dirs.src}/**/*.html`,
    php: `${dirs.src}/**/*.php`,
    styles: `${dirs.src}/assets/css`,
    scripts: `${dirs.src}/assets/js`,
    image: `${dirs.src}/**/*.{png,jpg,gif,svg}`,
  };

  /**************** CSS task ****************/
  function scssTask() {
    return src(`${sources.styles}/layout.scss`)
    .pipe(wait(1500))
    .pipe(plumber({ errorHandler: notify.onError('Error on <gulp sass>: <%= error.message %>') }))
    .pipe(sassGlob())
    .pipe(sourcemaps ? sourcemaps.init() : noop())
    .pipe(sass({
      includePaths: [
        sources.styles,
      ],
      outputStyle: 'expanded',
    }))
    .pipe(pleeease({
      autoprefixer: {
        browsers: ['last 2 versions', 'ie >= 10', 'iOS >= 8', 'Android >= 4'],
      },
      opacity: true,
      pseudoElements: false,
      minifier: true,
      minifier: {
        removeAllComments: true,
      }
    }))
    .pipe(sourcemaps ? sourcemaps.write() : noop())
    .pipe(notify('Complete Sass'))
    .pipe(dest(sources.styles))
    .pipe(browserSync ? browserSync.reload({ stream: true }) : noop());
  }

  /**************** JavaScript Task ****************/
  function jsTask() {
    var paths = [
      `${sources.scripts}/_libs/jquery-1.11.3.min.js`,
    ]
    return src(paths)
      .pipe(concat('bundle.js'))
      .pipe(uglify())
      .pipe(notify('Complete Library'))
      .pipe(dest(sources.scripts));
  }

  /**************** Server Task ****************/

  const syncConfig = {
    proxy: '127.0.0.1:1006',
    // server: {
    //   baseDir: dirs.src,
    // },
    middleware: ssi({
      baseDir: __dirname + '/_src',
      ext: ".html"
    }),
    ghostMode: false,
    notify: false,
    open: 'external',
  };

  // Browser Sync
  function server(done) {
    connect.server({
      base: dirs.src,
    }, function (){
      if (browserSync) browserSync.init(syncConfig);
    });
    done();
  }

  // browser reload
  function serverReload(done) {
    browserSync.reload();
    done();
  }

  /**************** Watch Task ****************/
  function watchTask(done) {

    // CSS changes
    watch(`${sources.styles}/**/*.scss`, scssTask);

    // Javacript changes
    watch(`${sources.scripts}/**/*.js`, serverReload);

    // Html changes
    watch(sources.html, serverReload);

    //watch(sources.php, serverReload);

    done();
  }


  /**************** Publish Task ****************/

  // Delete dist
  function delDist() {
    return del(dirs.dest);
  }

  // Copy source from App
  function copyApp() {
    return src(`${dirs.src}/**`)
      .pipe(dest(dirs.dest));
  }

  // Export html ssi
  async function htmlSSI() {
    return src(sources.html)
      .pipe(includer())
      .pipe(dest(dirs.dest));
  }

  // Minify Image
  function imagesMin() {
    return src(sources.image)
      .pipe(imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]))
      .pipe(dest(dirs.dest));
  }

  // Delete file not used
  function delNotUsed() {
    var delList = [
      `${dirs.dest}/assets/inc`,
      `${dirs.dest}/assets/css/**/*.scss`,
      `${dirs.dest}/assets/css/foundation`,
      `${dirs.dest}/assets/css/layout`,
      `${dirs.dest}/assets/css/object`,
      `${dirs.dest}/assets/css/_structure`,
      `${dirs.dest}/assets/css/_unique`,
      `${dirs.dest}/assets/_include`,
      `${dirs.dest}/assets/js/_libs`,
    ];
    return del(delList, { force: true });
  }

  /* =========================================== */

  //Default
  exports.default = series(
    parallel(scssTask, jsTask),
    watchTask,
    server,
  );

  //Build
  exports.build = series(
    delDist,
    parallel(scssTask, jsTask),
    copyApp,
    htmlSSI,
    imagesMin,
    delNotUsed,
  );

})();
