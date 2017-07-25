var gulp = require('gulp');
var concat = require('gulp-concat');
// var connect = require('gulp-connect');
var browserSync = require('browser-sync').create();
var gulpif = require('gulp-if');
var jshint = require('gulp-jshint');
var beautify = require('gulp-beautify');
var please = require('gulp-pleeease');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var processhtml = require('gulp-processhtml');
var uglify = require('gulp-uglify');
var del = require('del');
var path = require('path');
var imageop = require('gulp-image-optimization');
var runSequence = require('run-sequence');
var babel = require('gulp-babel');

var config = {
  folders : {
    dist : 'dist',
    assets : 'assets'
  },

  plugins : {
    js : [
      'bower_components/html5shiv/dist/html5shiv.min.js',
      'bower_components/respond/dest/respond.min.js'
    ],
    jsConcat : [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js'
    ],
    css : [
      'bower_components/bootstrap/dist/css/bootstrap.min.css',
      'bower_components/Ionicons/css/ionicons.min.css',
      'bower_components/font-awesome/css/font-awesome.min.css'
    ],
    fonts : [
      'bower_components/bootstrap/dist/fonts/*',
      'bower_components/Ionicons/fonts/*',
      'bower_components/font-awesome/fonts/*'
    ],
    img : [

    ]
  },

  distMode : false,
  environment : 'dev'
};

var paths = {
  dist : path.join(config.folders.dist),
  assets : path.join(config.folders.dist, config.folders.assets),
  html : path.join(config.folders.dist),
  js : path.join(config.folders.dist, config.folders.assets, 'js'),
  fonts : path.join(config.folders.dist, config.folders.assets, 'fonts'),
  css : path.join(config.folders.dist, config.folders.assets, 'css'),
  img : path.join(config.folders.dist, config.folders.assets, 'img'),
};

// gulp.task('connect', function() {
//   connect.server({
//     root: config.folders.dist,
//     port: 8080,
//     livereload: true
//   });
// });

gulp.task('connect', function() {
    browserSync.init({
        server: {
            baseDir: config.folders.dist,
        }
    });
});


var targets = {
  dist : {
    environment : 'dist',
    data : {
      assets : config.folders.assets,
    },
  },
  dev : {
    environment : 'dev',
    data : {
      assets : config.folders.assets,
    },
  },
};

gulp.task('plugins', function() {
  gulp.src(config.plugins.jsConcat)
    .pipe(gulpif(config.distMode, concat('plugins.min.js', {})))
    .pipe(gulpif(config.distMode, uglify(), beautify()))
    .pipe(gulp.dest(paths.js));

  gulp.src(config.plugins.js)
    .pipe(gulp.dest(paths.js));

  gulp.src(config.plugins.css)
    .pipe(gulpif(config.distMode, concat('plugins.min.css', {})))
    .pipe(gulp.dest(paths.css));

  gulp.src(config.plugins.fonts)
    .pipe(gulp.dest(paths.fonts));

  gulp.src(config.plugins.img)
    .pipe(gulp.dest(paths.img));
});

gulp.task('html', function() {

  gulp.src('src/html/**/*.html')
    .pipe(processhtml({
      recursive : true,
      process : true,
      strip : true,
      environment : targets.dev.environment,
      data: targets.dev.data,
    }))
    .pipe(gulp.dest(paths.dist))
    // .pipe(connect.reload());
    .pipe(browserSync.stream());

});

gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(babel({
      presets: ["env"],
    }))
    .pipe(jshint.reporter('default'))
    .pipe(gulpif(config.distMode, concat('app.min.js')))
    .pipe(gulpif(config.distMode, uglify()))
    .pipe(gulp.dest(paths.js))
    // .pipe(connect.reload());
    .pipe(browserSync.stream());
});

//TAREA DE GULP BABEL PARA LA VERSIÓN ES5

// gulp.task('babel', function(){
//   return gulp.src('src/js/**/*.js')
//     .pipe(babel({
//       presets: ["env"],
//     }))
//     .pipe(gulp.dest(paths.js));
// });

gulp.task('sass', function() {
  gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(config.distMode, please({
      "autoprefixer" : true,
      "filters" : true,
      "rem" : true,
      "opacity" : true
    })))
    .pipe(gulpif(config.distMode, rename({
      suffix : '.min',
      extname : '.css'
    })))
    .pipe(gulp.dest(paths.css))
    // .pipe(connect.reload());
    .pipe(browserSync.stream());
});

gulp.task('img', function() {
  gulp.src('src/img/**/*')
    .pipe(gulpif(config.distMode, imageop({
      optimizationLevel : 5,
      progressive : true,
      interlaced : true
    })))
    .pipe(gulp.dest(paths.img))
    // .pipe(connect.reload());
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest(paths.fonts))
    // .pipe(connect.reload());
    .pipe(browserSync.stream());
});

gulp.task('clean', function() {
  return del([
    paths.dist
  ]);
});

gulp.task('watch', function() {
  gulp.watch(['src/html/**/*'], ['html']).on('change', browserSync.reload);
  gulp.watch(['src/js/**/*'], ['js']).on('change', browserSync.reload);
  gulp.watch(['src/scss/**/*'], ['sass']).on('change', browserSync.reload);
  gulp.watch(['src/img/**/*'], ['img']).on('change', browserSync.reload);
  gulp.watch(['src/fonts/**/*'], ['fonts']).on('change', browserSync.reload);
});

// Visualizar el proyecto
gulp.task('default', function() {
  runSequence(
    ['connect', 'watch']
  );
});

// Compilación de desarrollo
gulp.task('dev', function() {
  runSequence(
    'clean',
    ['plugins', 'html', 'js', 'sass', 'img', 'fonts']
  );
});

// Trabajar en el proyecto y que esté pendiente de cambios
gulp.task('work', function() {
  // config.distMode = true;
  runSequence(
    'dev',
    'default'
  );
});

// Versión para subir a producción
gulp.task('dist', function() {
  config.distMode = true;
  config.environment = 'dist';

  runSequence(
    'clean',
    ['plugins', 'html', 'js', 'sass', 'img', 'fonts']
  );
});
