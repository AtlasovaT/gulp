const { src, dest, series, watch } = require('gulp');
const cl = require('gulp-clean');
const browserSync = require('browser-sync').create();

/* Копируем все содержимое из папки src в dist */
const copy = () => {
    return src('src/**/*.*')
        .pipe(dest('dist'))
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

const watchers = (done) => {
    watch('src/**/*.html').on('all',series(copy, browserSync.reload));
    done();
}

exports.default = series(clean, copy, watchers, server)
