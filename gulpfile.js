var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var server = require('gulp-develop-server');
var mocha = require('gulp-mocha');

var serverTS = ["**/*.ts", "!node_modules/**", '!bin/**', ];

gulp.task('ts', ['clean'], function() {
    return gulp
        .src(serverTS, {base: './app/'})
        .pipe(ts({ module: 'commonjs', noImplicitAny: true }))
        .pipe(gulp.dest('./app'));
});

gulp.task('clean', function () {
    return gulp
        .src([
            '!app/config/db/**',
            'app/app.js',
            '**/*.js',
            '**/*.js.map',
            '!node_modules/**',
            '!gulpfile.js',
            '!bin/**',
            '!app/config/db/knex'
        ], {read: false})
        .pipe(clean())
});

gulp.task('load:fixtures', function (cb) {
    var load = require('./fixtures/load');
    return load.loadData(cb);
});

gulp.task('server:start', ['ts'], function() {
    server.listen({path: 'app/bin/www'}, function(error) {
        console.log(error);
    });
});

gulp.task('server:restart', ['ts'], function() {
    server.restart();
});

gulp.task('default', ['server:start'], function() {
    gulp.watch(serverTS, ['server:restart']);
});

gulp.task('test', ['ts', 'load:fixtures'], function() {
    return gulp
        .src('test/*.js', {read: false})
        // wait for dev server to start properly :(
        //.pipe(wait(600))
        .pipe(mocha())
        .once('error', function () {
            process.exit(1);
        })
        .once('end', function () {
            process.exit();
        });
});
