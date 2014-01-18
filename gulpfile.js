/************
* Tasks: gulp ...
*
* jade -> Compile and minify .jade
* stylus -> Compile and minify main.styl
* scripts -> Concat and uglify .js
* minify-html -> compress html, remove comments and empty attributes
* minify-img -> optimize png/gif/jpg
* font -> svg to ttf | tff to eot | ttf to woff
* fpt -> transfer files to the server 
* server -> Creates a web server
* build -> Compile jade/stylus/scripts | optimize images | convert fonts
* default -> Compile jade/stylus/scripts
*
* ♥
*/

/************
* Dependencies
*/
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	jade = require('gulp-jade'),
	stylus = require('gulp-stylus'),
	minifyCSS = require('gulp-minify-css'),
	svg2ttf = require('gulp-svg2ttf'),
	ttf2eot = require('gulp-ttf2eot'),
	ttf2woff = require('gulp-ttf2woff'),
	minifyHTML = require('gulp-minify-html'),
	imagemin = require('gulp-imagemin'),
	ftp = require('gulp-ftp');
	express = require('express');
	
/************
* Conf. express
*
* 1# Port that will run express
* 2# The build folder
* 3# Show hidden files
* 4# Show icons
*
* https://npmjs.org/package/express
*/
	var ConfExpress = {
		port: 8080,
		folder: 'build/',
		showHiddenFiles: false,
		icons: true,
	};

/************
* Conf. Jade
*
* #1 Task name
* #2 Input Folder
* #3 Output Folder
* #4 html format
*
* https://npmjs.org/package/gulp-jade
*/
	var ConfJade = {
		taskName: 'jade',
		inputFolder: './dev/jade/*',
		outputFolder: './build/',
		pretty: false
	}

/************
* Conf. Stylus
*
* #1 Task name
* #2 Input Folder
* #3 Output folder
* #4 Output minify name 
*
* https://npmjs.org/package/gulp-stylus
*/
	var ConfStylus = {
		taskName: 'stylus',
		inputFolder: './dev/stylus/main',
		outputFolder: './build/app/css/',
		minifyName: 'main.min'
	}

/************
* Conf. Javascript
*
* 1# The task name
* 2# 
* 3#
* 4#
*
* https://npmjs.org/package/gulp-concat
* https://npmjs.org/package/gulp-uglify
*/
	var ConfJS = {
		taskName: 'scripts',
		inputFolder: './dev/js/**/*',
		outputFolder: './build/app/js/',
		minifyName: 'main.min.js'
	}

/************
* Conf. HTML
*
* #1 The task name
* #2 false: remove empty attributes
* #3 false: remove comments
*
* https://npmjs.org/package/gulp-minify-html
*/
	var ConfHTML = {
		taskName: 'minify-html',
		inputFolder: './build/*',
		outputFolder: './build/',
		empty: false,
		comments: false

	}

/************
* Conf. Image
*
* https://npmjs.org/package/gulp-imagemin
*/
	var ConfIMG = {
		taskname: 'minify-img',
		inputFolder: './dev/image/**/*',
		outputFolder: './build/app/image/'
	}

/************
* Conf. fonts
*
* #1 
* #2
*
* https://npmjs.org/package/gulp-svg2ttf
* https://npmjs.org/package/gulp-ttf2eot
* https://npmjs.org/package/gulp-ttf2woff
*/
	var ConfFont = {
		taskName: 'font',
		folder: './dev/app/font/*'
	}

/************
* Conf Ftp
*
* https://npmjs.org/package/gulp-ftp
*/
	var ConfFTP = {
            host: '',
            user: '',
            pass: '',
            remotePath: '/'
        }

/************
* Tasks
*/

/**
* jade
*/
gulp.task(ConfJade.taskName, function() {
	gulp.src(ConfJade.inputFolder + '.jade')
		.pipe(jade(ConfJade))
		.pipe(gulp.dest(ConfJade.outputFolder));
});

/**
* stylus
*/
gulp.task(ConfStylus.taskName, function() {
	gulp.src(ConfStylus.inputFolder + '.styl')
		.pipe(stylus())
		.pipe(minifyCSS())
		.pipe(gulp.dest(ConfStylus.outputFolder))
});

/**
* scripts
*/
gulp.task(ConfJS.taskName, function() {
	gulp.src(ConfJS.inputFolder + '.js')
		.pipe(concat(ConfJS.minifyName))
		.pipe(uglify())
		.pipe(gulp.dest(ConfJS.outputFolder));
});

/**
* html
*/
gulp.task(ConfHTML.taskName, function() {
	gulp.src(ConfHTML.inputFolder + '.html')
		.pipe(minifyHTML(ConfHTML))
		.pipe(gulp.dest(ConfHTML.outputFolder))
})

/**
* image
*/
gulp.task(ConfIMG.taskname, function () {
    gulp.src([ConfIMG.inputFolder + '.png', ConfIMG.inputFolder + '.jpg', ConfIMG.inputFolder + '.gif'])
        .pipe(imagemin())
        .pipe(gulp.dest(ConfIMG.outputFolder));
});

/**
* fonts
*/
gulp.task(ConfFont.taskName, function() {
	gulp.src([ConfFont.folder + '.svg'])
    		.pipe(svg2ttf())
    		.pipe(gulp.dest(ConfFont.folder));
   	gulp.src([ConfFont.folder +'.ttf'])
    		.pipe(ttf2eot())
    		.pipe(gulp.dest(ConfFont.folder));
	gulp.src([ConfFont.folder + '.ttf'])
    		.pipe(ttf2woff())
    		.pipe(gulp.dest(ConfFont.folder));
});

/**
* ftp
*/
gulp.task('ftp', function() {
	gulp.src('./dev/*')
        	.pipe(ftp(ConfFTP));
})

/**
* server
*/
gulp.task('server', function() {
	var app = express();
	app.configure(function() {
	    app.use(express.static(__dirname + ConfExpress.folder));
	    app.use(express.directory(__dirname + ConfExpress.folder, {hidden: ConfExpress.showHiddenFiles, icons: ConfExpress.icons, filter:false}));
	});
	app.listen(ConfExpress.port);
	console.log('Server is running at port ' + ConfExpress.port);
});

/**
* build
*/
gulp.task('build', function() {
	gulp.run(ConfJade.taskName, ConfJS.taskName, ConfStylus.taskName, ConfIMG.taskname, ConfFont.taskName);
	console.log('Build Complete!');
});

/**
* default
*/
gulp.task('default', function() {
	gulp.run(ConfJade.taskName, ConfJS.taskName, ConfStylus.taskName, ConfFont.taskName);
	gulp.run('server');
})
