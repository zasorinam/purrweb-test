const gulp = require('gulp');
const concat = require('gulp-concat');
const debug = require('gulp-debug');

const Builder = require('gulp-bem-bundle-builder');
const bundlerFs = require('gulp-bem-bundler-fs');

const builder = Builder({
    levels: ['blocks']
});

gulp.task('build', function() {
    return bundlerFs('pages/*')
        .pipe(builder({
            css: bundle => bundle.src('css')
                .pipe(concat(bundle.name + '.css'))
        }))
        .on('error', console.error)
        .pipe(debug())
        .pipe(gulp.dest(file => {return file.base;}));
});

gulp.task('default', gulp.series('build'));
