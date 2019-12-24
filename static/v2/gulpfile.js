var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

gulp.task('sprite', function() {
    var spriteData = gulp
        .src('assets/sprite/i/img/*.png')
        .pipe(spritesmith({
            imgName: 'i.png',
            imgPath: '../images/i.png',
            cssName: 'i.less',
            cssTemplate: 'assets/sprite/i/less.mustache',
            padding: 8
        }));
    spriteData.css.pipe(gulp.dest('./assets/sprite/i/'));
    spriteData.img.pipe(gulp.dest('./assets/images/'));
    return spriteData;
});