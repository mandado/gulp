/************
* Task: gulp ...
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
*
* default task -> Compile jade/stylus/scripts and run server
*
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
	minifyHTML = require('gulp-minify-html'),
	svg2ttf = require('gulp-svg2ttf'),
	ttf2eot = require('gulp-ttf2eot'),
	ttf2woff = require('gulp-ttf2woff'),
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
		folder: '/build',
		showHiddenFiles: false,
		icons: true,
	};

/************
* Conf your browser
* #1 The path of your browser | Remember to escape characters
* exemple: C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe
*		   C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe
*		   '' -> No browser
*/
	var ConfBrowser = {
		path: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
	}

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
* 1# Task name
* #2 Input Folder
* #3 Output folder
* 4# Output minify name
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
* #1 Task name
* #2 Input folder
* #3 Output folder
* #4 false: remove empty attributes
* #5 false: remove comments
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
* #1 Task name
*
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
* #1 Task name
* #2 Input Folder
* #3 Output Folder
*
* https://npmjs.org/package/gulp-svg2ttf
* https://npmjs.org/package/gulp-ttf2eot
* https://npmjs.org/package/gulp-ttf2woff
*/
	var ConfFont = {
		taskName: 'font',
		inputFolder: './dev/app/font/*',
		outputFolder: './dev/app/font/'
	}

/************
* Conf Ftp
*
* #1 Task name
* #2 FTP Host
* #3 USR
* #4 PASS
* #5 Folder to be accessed
* https://npmjs.org/package/gulp-ftp
*/
	var ConfFTP = {
			taskName: 'ftp',
            host: '',
            user: '',
            pass: '',
            remotePath: '/',
            inputFolder: './build/*'
	}

/************
* All Tasks
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
* font
*/
gulp.task(ConfFont.taskName, function() {
	gulp.src([ConfFont.inputFolder + '.svg'])
    		.pipe(svg2ttf())
    		.pipe(gulp.dest(ConfFont.folder));
   	gulp.src([ConfFont.inputFolder +'.ttf'])
    		.pipe(ttf2eot())
    		.pipe(gulp.dest(ConfFont.folder));
	gulp.src([ConfFont.inputFolder + '.ttf'])
    		.pipe(ttf2woff())
    		.pipe(gulp.dest(ConfFont.outputFolder));
});

/**
* ftp
*/
gulp.task(ConfFTP.taskName, function() {
	gulp.src(ConfFTP.inputFolder)
        	.pipe(ftp(ConfFTP));
})

/**
* server
*/
gulp.task('server', function() {
	var app = express(),
	    cp,
	    browser;

	app.configure(function() {
	    app.use(express.static(__dirname + ConfExpress.folder));
	    app.use(express.directory(__dirname + ConfExpress.folder, {hidden: ConfExpress.showHiddenFiles, icons: ConfExpress.icons, filter:false}));
	    app.use(express.errorHandler());
	});
	app.listen(ConfExpress.port);
	if (typeof(ConfBrowser.path) != undefined && ConfBrowser.path != '' && ConfBrowser.path != "") {
		cp = require('child_process');
		browser = cp.spawn(ConfBrowser.path, ['-new-tab', 'http://localhost:' + ConfExpress.port + '/']);
	}
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
	gulp.run(ConfJade.taskName, ConfJS.taskName, ConfStylus.taskName, ConfFont.taskName,'server');
});
