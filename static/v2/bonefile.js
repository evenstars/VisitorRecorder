var bone = require('bone');
var path = require('path');
var less = bone.require('bone-act-less');
var layout = bone.require('bone-act-htmllayout');
var autoprefixer = bone.require('bone-act-autoprefixer');
var include = bone.require('bone-act-include');
var reclude = bone.require('bone-act-reclude');
var buble = bone.require('bone-act-buble');
var concat = bone.require('bone-act-concat');

var dist = bone.dest('dist');
var static = dist.dest('static');
// 制作稿
dist.dest('pages')
    .src('~/pages/*.html')
    .act(layout)
    .act(include);
// 样式文件
static.dest('css')
    .src('~/assets/less/**/style.less')
    .dir('./')
    .act(less({
        ieCompat: false
    }))
    .act(autoprefixer({
        browsers: ['> 1%'],
    }, {
        filter: {
            ext: '.less'
        }
    }))
    .rename(function(fileName, filePath, fileInfo) {
        return path.basename(fileInfo.dir)+ '.css';
    });
// 图片文件
static.dest('images')
    .src('~/assets/images/**/*');
// 资源文件
static.dest('resources')
    .src('~/assets/resources/*');

dist.src('~/src/index.html');

// release
bone.task('release', 'build');

bone.cli(require('bone-cli-build')({
    // showDependentTrace: true
}));

bone.task('page', {
    cli: require('bone-cli-connect')({
        base: 'dist',
        livereload: true
    })
});
