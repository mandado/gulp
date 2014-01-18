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
*
* watch -> Watch jade/stylus/scripts
* server -> Creates a web server | Watch files
* build -> Compile jade/stylus/scripts | optimize images | convert fonts
*
* default task -> Compile jade/stylus/scripts and run server
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
	ftp = require('gulp-ftp'),
	express = require('express'),
	Conf = {};

/************
* Conf. express
*
* 1# Port that will run express
* 2# The build folder
* 3# Show hidden files
* 4# Show icons
*
* About express: https://npmjs.org/package/express
*/
	Conf.ConfServer = {
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
	Conf.ConfBrowser = {
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
* about Jade: http://jade-lang.com/api/
* about module: https://npmjs.org/package/gulp-jade
*/
	Conf.ConfJade = {
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
* about stylus: http://learnboost.github.io/stylus/
* about module: https://npmjs.org/package/gulp-stylus
*/
	Conf.ConfStylus = {
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
* about concat: https://npmjs.org/package/gulp-concat
* about: uglify: https://npmjs.org/package/gulp-uglify
*/
	Conf.ConfJS = {
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
* about minify html: https://npmjs.org/package/gulp-minify-html
*/
	Conf.ConfHTML = {
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
* #2 Input folder 
* #3 Output folder
*
* about imagemin: https://npmjs.org/package/gulp-imagemin
*/
	Conf.ConfIMG = {
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
* about svg2ttf: https://npmjs.org/package/gulp-svg2ttf
* about ttf2eot: abhttps://npmjs.org/package/gulp-ttf2eot
* about ttf2woff: https://npmjs.org/package/gulp-ttf2woff
*/
	Conf.ConfFont = {
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
* 
* about ftp: https://npmjs.org/package/gulp-ftp
*/
	Conf.ConfFTP = {
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
gulp.task(Conf.ConfJade.taskName, function() {
	gulp.src(Conf.ConfJade.inputFolder + '.jade')
		.pipe(jade(Conf.ConfJade))
		.pipe(gulp.dest(Conf.ConfJade.outputFolder));
});

/**
* stylus
*/
gulp.task(Conf.ConfStylus.taskName, function() {
	gulp.src(Conf.ConfStylus.inputFolder + '.styl')
		.pipe(stylus())
		.pipe(minifyCSS())
		.pipe(gulp.dest(Conf.ConfStylus.outputFolder));
});

/**
* scripts
*/
gulp.task(Conf.ConfJS.taskName, function() {
	gulp.src(Conf.ConfJS.inputFolder + '.js')
		.pipe(concat(Conf.ConfJS.minifyName))
		.pipe(uglify())
		.pipe(gulp.dest(Conf.ConfJS.outputFolder));
});

/**
* html
*/
gulp.task(Conf.ConfHTML.taskName, function() {
	gulp.src(Conf.ConfHTML.inputFolder + '.html')
		.pipe(minifyHTML(Conf.ConfHTML))
		.pipe(gulp.dest(Conf.ConfHTML.outputFolder));
});

/**
* image
*/
gulp.task(Conf.ConfIMG.taskname, function () {
	gulp.src([Conf.ConfIMG.inputFolder + '.png', Conf.ConfIMG.inputFolder + '.jpg', Conf.ConfIMG.inputFolder + '.gif'])
        	.pipe(imagemin())
        	.pipe(gulp.dest(Conf.ConfIMG.outputFolder));
});

/**
* font
*/
gulp.task(Conf.ConfFont.taskName, function() {
	gulp.src([Conf.ConfFont.inputFolder + '.svg'])
    		.pipe(svg2ttf())
    		.pipe(gulp.dest(Conf.ConfFont.folder));
   	gulp.src([Conf.ConfFont.inputFolder +'.ttf'])
    		.pipe(ttf2eot())
    		.pipe(gulp.dest(Conf.ConfFont.folder));
	gulp.src([Conf.ConfFont.inputFolder + '.ttf'])
    		.pipe(ttf2woff())
    		.pipe(gulp.dest(Conf.ConfFont.outputFolder));
});

/**
* ftp
*/
gulp.task(Conf.ConfFTP.taskName, function() {
	gulp.src(Conf.ConfFTP.inputFolder)
        	.pipe(ftp(Conf.ConfFTP));
});

/**
* watch
*/
gulp.task('watch', function() {
	gulp.watch(Conf.ConfJade.inputFolder, function() {
		gulp.run(Conf.ConfJade.taskName);
	});
	gulp.watch(Conf.ConfStylus.inputFolder + '.styl', function() {
		gulp.run(Conf.ConfStylus.taskName);
	});
	gulp.watch(Conf.ConfJS.inputFolder, function() {
		gulp.run(Conf.ConfJS.taskName);
	});
	gutil.log('Is watching!');
});

/**
* server
*/
gulp.task('server', function() {
	var app = express(),
	    cp,
	    browser;

	app.configure(function() {
	    app.use(express.static(__dirname + Conf.ConfServer.folder));
	    app.use(express.directory(__dirname + Conf.ConfServer.folder, {hidden: Conf.ConfServer.showHiddenFiles, icons: Conf.ConfServer.icons, filter:false}));
	    app.use(express.errorHandler());
	});
	app.listen(Conf.ConfServer.port);
	if (typeof(Conf.ConfBrowser.path) != undefined && Conf.ConfBrowser.path != '' && Conf.ConfBrowser.path != "") {
		cp = require('child_process');
		browser = cp.spawn(Conf.ConfBrowser.path, ['-new-tab', 'http://localhost:' + Conf.ConfServer.port + '/']);
	}
	gulp.run('watch');
	gutil.log('Server is running at port ' + Conf.ConfServer.port);
});

/**
* build
*/
gulp.task('build', function() {
	gulp.run(Conf.ConfJade.taskName, Conf.ConfJS.taskName, Conf.ConfStylus.taskName, Conf.ConfIMG.taskname, Conf.ConfFont.taskName);
	gutil.log('Build Complete!');
});

/**
* help
*/
gulp.task('help', function() {
	gutil.log('Task: gulp.. \njade -> Compile and minify .jade \nstylus -> Compile and minify main.styl \nscripts -> Concat and uglify .js\nminify-html -> compress html, remove comments and empty attributes\nminify-img -> optimize png/gif/jpg\nfont -> svg to ttf | tff to eot | ttf to woff\nfpt -> transfer files to the server\nserver -> Creates a web server\nbuild -> Compile jade/stylus/scripts | optimize images | convert fonts\ndefault task -> Compile jade/stylus/scripts and run server');
});

/**
* default
*/
gulp.task('default', function() {
	gulp.run(Conf.ConfJade.taskName, Conf.ConfJS.taskName, Conf.ConfStylus.taskName, Conf.ConfFont.taskName,'server');
});
