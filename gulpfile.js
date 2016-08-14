// generated on 2016-08-04 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
// const concat = require('gulp-concat');
const uglifyjs = require('uglify-js-harmony');
const minifier = require('gulp-uglify/minifier');
const pump = require('pump');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', ['clean'], () => {
  return gulp.src('app/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe($.concat('main.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('vendor-styles', ['clean', 'html'], () => {
  return gulp.src('.tmp/styles/vendor.css')
    .pipe(gulp.dest('dist/styles'))
});

gulp.task('scripts', ['clean', 'scripts-vendor', 'angular-templates'], () => {
  return gulp.src('.tmp/scripts/*.js')
    .pipe($.plumber())
    // .pipe($.sourcemaps.init())
    .pipe($.babel({presets: ['es2015']}))
    .pipe($.ngAnnotate())
    // .pipe($.sourcemaps.write('.'))
    // .pipe($.if('*.js', minifier(null, uglifyjs).on('error', function(e){
    //     console.log('ERROR:', e);
    //  })))
    // .pipe($.uglify())
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}));
});

gulp.task('scripts-vendor', ['clean', 'html'], () => {
  return gulp.src('.tmp/scripts/vendor/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('dist/scripts/vendor'));
});

gulp.task('angular-templates', function () {
  return gulp.src(['app/**/*.html', '!app/index.html'])
    .pipe($.angularTemplatecache({module: 'app'}))
    .pipe(gulp.dest('.tmp/scripts'));
});

function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest('app'));
});
gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec/**/*.js'));
});

gulp.task('html', ['clean', 'styles'], () => {
  return gulp.src('app/index.html')
    .pipe($.useref({searchPath: ['.tmp', '.', 'app']}))
    // .pipe($.if('*.js', $.uglify()))
    // .pipe($.if('*.js', minifier(null, uglifyjs).on('error', function(e){
    //     console.log('FUCKING ERROR:', e);
    //  })))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('html-min', ['html'], () => {
  return gulp.src('.tmp/index.html')
    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', ['clean'], () => {
  return gulp.src('app/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

// gulp.task('fonts', () => {
//   return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
//     .concat('app/**/*.{eot,ttf,woff,woff2}'))
//     .pipe(gulp.dest('.tmp/fonts'))
//     .pipe(gulp.dest('dist/fonts'));
// });

gulp.task('fonts', ['clean'], () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['wiredep', 'build'], () => {
  browserSync({
    browser: 'google chrome',
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app', 'dist'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/**/*.html',
    'app/**/*.{jpg,jpeg,png,gif,svg}',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/**/*.scss', ['styles']);
  gulp.watch('app/**/*.js', ['scripts']);
  gulp.watch('app/fonts/**/*.{eot,ttf,woff,woff2}', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
});

gulp.task('serve:test', ['scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/**/*.js', ['scripts']);
  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/**/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app'));

  gulp.src('app/index.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('build', [
    'clean', 
    'lint', 
    'html', 
    'html-min', 
    'vendor-styles', 
    'angular-templates', 
    'scripts-vendor', 
    'scripts', 
    'images', 
    'fonts'
  ], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
