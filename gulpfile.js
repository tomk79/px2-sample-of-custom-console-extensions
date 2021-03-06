let conf = require('config');
// console.log(conf);
let gulp = require('gulp');
let webpack = require('webpack');
let webpackStream = require('webpack-stream');
let sass = require('gulp-sass');//CSSコンパイラ
let autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
let minifyCss = require('gulp-minify-css');//CSSファイルの圧縮ツール
let uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
let concat = require('gulp-concat');//ファイルの結合ツール
let plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
let rename = require("gulp-rename");//ファイル名の置き換えを行う
let browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
let packageJson = require(__dirname+'/package.json');

// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	return gulp.src("src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass({
			"sourceComments": false
		}))
		.pipe(autoprefixer())
		.pipe(rename({
			extname: ''
		}))
		.pipe(rename({
			extname: '.css'
		}))
		.pipe(gulp.dest( './dist/' ))

		.pipe(minifyCss({compatibility: 'ie8'}))
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(gulp.dest( './dist/' ))
	;
});

// sample-of-custom-console-extensions.js (frontend) を処理
gulp.task("sample-of-custom-console-extensions.js", function() {
	return webpackStream({
		mode: 'production',
		entry: "./src/sample-of-custom-console-extensions.js",
		output: {
			filename: "sample-of-custom-console-extensions.js"
		},
		module:{
			rules:[
				{
					test:/\.twig$/,
					use:['twig-loader']
				},
				{
					test:/\.html$/,
					use:['html-loader']
				}
			]
		}
	}, webpack)
		.pipe(plumber())
		.pipe(gulp.dest( './dist/' ))
		.pipe(concat('sample-of-custom-console-extensions.min.js'))
		// .pipe(uglify())
		.pipe(gulp.dest( './dist/' ))
	;
});


// *.js を処理
gulp.task("test/contents.js:js", function() {
	return gulp.src(["tests/app/client/index_files/contents.src.js"])
		.pipe(plumber())
		.pipe(browserify({
		}))
		// .pipe(uglify())
		.pipe(concat('contents.js'))
		.pipe(gulp.dest( 'tests/app/client/index_files/' ))
	;
});


// ブラウザを立ち上げてプレビューする
gulp.task("preview", function(callback) {
	require('child_process').spawn('open',[conf.origin+'/']);
	callback();
});

let _tasks = gulp.parallel(
	'sample-of-custom-console-extensions.js',
	'.css.scss',
	'test/contents.js:js'
);

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["src/**/*", "tests/app/client/**/*.src.js"], _tasks);
});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
