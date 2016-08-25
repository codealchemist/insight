// generated on 2016-08-04 using generator-webapp 2.1.0
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const wiredep = require('wiredep').stream;
const concat = require('gulp-concat');
const uglifyjs = require('uglify-js-harmony');
const minifier = require('gulp-uglify/minifier');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
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
    .pipe(gulp.dest('.tmp'))

    // get just one css file
    .pipe(concat('main.css'))
    .pipe(gulp.dest('.tmp/core'))

    .pipe(reload({stream: true}));
});

gulp.task('scripts', () => {
  return gulp.src('app/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({presets: ['es2015']}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(reload({stream: true}));
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

gulp.task('html', ['styles', 'angular-templates'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.size({showFiles: true}))
    .pipe($.if('scripts/*.js', $.babel({presets: ['es2015']}))) // need to transpile to avoid erros with object shorthand on uglify
    .pipe($.if('scripts/*.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe($.size({showFiles: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('mintest', () => {
  return gulp.src('.tmp/scripts/main.js')
    .pipe($.babel({presets: ['es2015']}))
    .pipe(minifier(null, uglifyjs).on('error', function(e){
      console.log('ERROR:', e);
    }))
    .pipe(gulp.dest('.tmp/mintest'));
});

gulp.task('angular-templates', () => {
  return gulp.src(['app/**/*.html', '!app/index.html'])
    .pipe($.angularTemplatecache({module: 'app'}))
    .pipe(gulp.dest('app'));
});

gulp.task('images', () => {
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

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('app/**/*.{eot,ttf,woff,woff2}'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.sync(['.tmp', 'dist']));

gulp.task('serve', ['clean', 'wiredep', 'styles', 'angular-templates', 'scripts', 'fonts'], () => {
  browserSync({
    browser: 'google chrome',
    notify: false,
    port: 9000,
    server: {
      baseDir: ['app', '.tmp', '.'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/index.html',
    'app/**/*.{jpg,jpeg,png,gif,svg}',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/*.html', () => {
    gulp.start('angular-templates');
    reload();
  });

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

gulp.task('build', ['clean', 'lint', 'html', 'images', 'fonts'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
