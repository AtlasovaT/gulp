const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass');
const cl = require('gulp-clean');
const autoprefixer = require('gulp-autoprefixer');
// const px2rem = require('gulp-smile-px2rem');
var pxtorem = require('gulp-pxtorem');
const sourcemaps = require('gulp-sourcemaps');
const sassGlob = require('gulp-sass-glob');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

/* Копируем все содержимое из папки src в dist */
const copy = () => {
    return src('src/**/*.html')
        .pipe(dest('dist'))
}

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
        .pipe(dest('./dist/styles'))
        .pipe(browserSync.stream());
}

/**
 * Очищаем папку dist
 */
const clean = () => {
    return src('dist/**/*').pipe(cl());
}

const styles = [
    'node_modules/normalize.css/normalize.css',
    'src/styles/main.scss'
]

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

const watchers = (done) => {
    watch('src/**/*.html').on('all',series(copy, browserSync.reload));
    watch('src/**/*.scss', series(compileScss));
    done();
}

exports.default = series(clean, compileScss, copy, watchers, server)
