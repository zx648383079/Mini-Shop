var gulp = require('gulp'),
    sass = require("gulp-sass"),
    rename = require('gulp-rename'),
    ts = require("gulp-typescript"),
    tap = require('gulp-tap'),
    template = require('./gulp-tempate'),
    path = require('path'),
    tsProject = ts.createProject('tsconfig.json');
gulp.task('ts', async() => {
    await gulp.src('src/**/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest('dist/'));
});

gulp.task('sass', async() => {
    await gulp.src('src/**/*.{scss,sass}')
        .pipe(sass())
        .pipe(rename({extname: '.wxss'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('vuejs', async() => {
    await gulp.src('src/**/*.{vue,html}')
        .pipe(template('js'))
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('vuets', async() => {
    await gulp.src('src/**/*.{vue,html}')
        .pipe(template('ts'))
        .pipe(rename({extname: '.ts'}))
        .pipe(tsProject())
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('vuecss', async() => {
    await gulp.src('src/**/*.{vue,html}')
        .pipe(template('css'))
        .pipe(rename({extname: '.wxss'}))
        .pipe(gulp.dest('dist/'));
});
gulp.task('vuesass', async() => {
    await gulp.src('src/**/*.{vue,html}')
        .pipe(template('sass'))
        .pipe(sass())
        .pipe(rename({extname: '.wxss'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('vue', gulp.series('vuejs', 'vuets', 'vuecss', 'vuesass', async() => {
    await gulp.src('src/**/*.{vue,html}')
        .pipe(template('tpl'))
        .pipe(rename({extname: '.wxml'}))
        .pipe(gulp.dest('dist/'));
}))

gulp.task('default', gulp.series('ts', 'sass', async() => {
    await gulp.src('src/**/*.{js,json,wxml,wxss,png,jpg,jpeg}')
            .pipe(gulp.dest('dist/'));
}));