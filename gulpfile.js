const { src, dest, series, watch } = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const cl = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
// const px2rem = require('gulp-smile-px2rem');
var pxtorem = require('gulp-pxtorem');
const sourcemaps = require('gulp-sourcemaps');
const sassGlob = require('gulp-sass-glob');
var uglify = require('gulp-uglify');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

// const pictures = ['src/assets/images/*.jpg', 'src/assets/images/*.png', 'src/assets/images/*.svg']

const images = () => {
    return src(['src/assets/images/*.jpg', 'src/assets/images/*.png'])
        .pipe(dest('./dist/assets/images/'))
}

// const markup = ['src/pages/*.pug', 'src/templates/**/*.pug']

const compilePug = () => {
    return src(['src/pages/*.pug'])
        .pipe(pug({
            pretty: true,
        }))
        .pipe(dest('dist'));
}

const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/js/vendors/owl/dist/assets/owl.carousel.css',
    'src/styles/main.scss'
]

const compileScss = () => {
    return src(styles)
        .pipe(concat('main.scss'))
        .pipe(sassGlob())
        .pipe(sourcemaps.init())
        .pipe(
            sass().on('error', sass.logError)
        )
        // .pipe(px2rem())
        .pipe(pxtorem())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        }))
        .pipe(gcmq())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(dest('./dist/styles/'))
        .pipe(browserSync.stream());
}

/**
 * Очищаем папку dist
 */
const clean = () => {
    return src('dist/**/*').pipe(cl());
}



/**
 * Запускаем наш сервер
 */
const server = (done) => {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    done();
};

const libs = [
    'node_modules/jquery/dist/jquery.min.js',
    'src/js/vendors/owl/dist/owl.carousel.min.js',
    'src/js/scripts/*.js'
];

const compileScripts = () => {
    return src(libs)
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js', { newLine: ";"}))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest('./dist/js'))
        .pipe(browserSync.stream());
}

const watchers = (done) => {
    watch(['src/assets/images/*.jpg', 'src/assets/images/*.png']).on('all',series(images, browserSync.reload));
    watch(['src/pages/*.pug']).on('all',series(compilePug, browserSync.reload));
    watch('src/**/*.scss', series(compileScss));
    watch(['src/js/scripts/*.js'], series(compileScripts));
    done();
}

exports.default = series(clean, images, compilePug, compileScss, compileScripts, watchers, server)
