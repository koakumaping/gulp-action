import gulp from 'gulp'
import gutil from 'gulp-util'
import uglify from 'gulp-uglify'
import watchPath from 'gulp-watch-path'
import combiner from 'stream-combiner2'
import sourcemaps from 'gulp-sourcemaps'
import cleanCSS from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import babel from 'gulp-babel'
import stylus from 'gulp-stylus'
import imagemin from 'gulp-imagemin'

let handleError = function (err) {
    let colors = gutil.colors;
    console.log('\n')
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

gulp.task('watchjs', function () {
    gulp.watch('src/js/**/*.js', function (event) {
        let paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        let combined = combiner.obj([
            gulp.src(paths.srcPath),
            babel(),
            sourcemaps.init(),
            // uglify(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])

        combined.on('error', handleError)
    })
})

gulp.task('uglifyjs', function () {
    let combined = combiner.obj([
        gulp.src('src/js/**/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest('dist/js/')
    ])
    combined.on('error', handleError)
})


gulp.task('watchcss', function () {
    gulp.watch('src/css/**/*.css', function (event) {
        let paths = watchPath(event, 'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(cleanCSS())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('cleanCSS', function () {
    gulp.src('src/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: 'last 2 versions'
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
})

gulp.task('watchstylus',function () {
    gulp.watch('src/stylus/**/*', function (event) {
        let paths = watchPath(event, 'src/stylus/', 'dist/css/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        
        let combined = combiner.obj([
            gulp.src(paths.srcPath),
            stylus(),
            sourcemaps.init(),
            autoprefixer({
              browsers: 'last 5 versions'
            }),
            cleanCSS(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])
        combined.on('error', handleError)
    })
})

gulp.task('styluscss', function () {
    gulp.src('src/stylus/**/*.styl')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(stylus())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: 'last 5 versions'
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css/'))
})


gulp.task('watchless', function () {
    gulp.watch('src/less/**/*.less', function (event) {
        let paths = watchPath(event, 'src/less/', 'dist/css/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        let combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
              browsers: 'last 2 versions'
            }),
            less(),
            minifycss(),
            sourcemaps.write('./'),
            gulp.dest(paths.distDir)
        ])
        combined.on('error', handleError)
    })
})

gulp.task('lesscss', function () {
    let combined = combiner.obj([
        gulp.src('src/less/**/*.less'),
        sourcemaps.init(),
        autoprefixer({
          browsers: 'last 2 versions'
        }),
        less(),
        minifycss(),
        sourcemaps.write('./'),
        gulp.dest('dist/css/')
    ])
    combined.on('error', handleError)
})


gulp.task('watchsass',function () {
    gulp.watch('src/sass/**/*', function (event) {
        let paths = watchPath(event, 'src/sass/', 'dist/css/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)
        sass(paths.srcPath)
            .on('error', function (err) {
                console.error('Error!', err.message);
            })
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(autoprefixer({
              browsers: 'last 2 versions'
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('sasscss', function () {
        sass('src/sass/')
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sourcemaps.init())
        .pipe(minifycss())
        .pipe(autoprefixer({
          browsers: 'last 2 versions'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
})

gulp.task('watchimage', function () {
    gulp.watch('src/img/**/*', function (event) {
        let paths = watchPath(event,'src/','dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('image', function () {
    gulp.src('src/img/**/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('dist/img'))
})

gulp.task('watchcopy', function () {
    gulp.watch('src/fonts/**/*', function (event) {
        let paths = watchPath(event,'src/', 'dist/')

        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
        gutil.log('Dist ' + paths.distPath)

        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir))
    })
})

gulp.task('copy', function () {
    gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts/'))
})

gulp.task('default', [
        'watchjs', 
        'watchcss',
        'watchstylus',
        'watchless',
        'watchsass',
        'watchimage',
        'watchcopy'
    ]
)