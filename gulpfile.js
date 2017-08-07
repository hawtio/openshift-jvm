var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    eventStream = require('event-stream'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    del = require('del'),
    fs = require('fs'),
    path = require('path'),
    size = require('gulp-size'),
    uri = require('urijs'),
    s = require('underscore.string'),
    hawtio = require('hawtio-node-backend'),
    urljoin = require('urljoin'),
    tslint = require('gulp-tslint'),
    ghPages = require('gh-pages'),
    tslintRules = require('./tslint.json'),
    del = require('del');

var plugins = gulpLoadPlugins({});
var pkg = require('./package.json');
var bower = require('./bower.json');
bower.packages = {};

function getVersionString() {
  return JSON.stringify({
    name: bower.name,
    version: bower.version,
    commitId: bower.commitId,
    packages: bower.packages
  }, undefined, 2);
}

var config = {
  main: '.',
  ts: ['plugins/**/*.ts'],
  testTs: ['test-plugins/**/*.ts'],
  less: ['plugins/**/*.less'],
  templates: ['plugins/**/*.html'],
  testTemplates: ['test-plugins/**/*.html'],
  templateModule: pkg.name + '-templates',
  testTemplateModule: pkg.name + '-test-templates',
  dist: './dist/',
  js: pkg.name + '.js',
  testJs: pkg.name + '-test.js',
  css: pkg.name + '.css',
  tsProject: plugins.typescript.createProject('tsconfig.json'),
  tsLintOptions: {
    rulesDirectory: './tslint-rules/',
    emitError: false
  }
};

var normalSizeOptions = {
    showFiles: true
}, gZippedSizeOptions  = {
    showFiles: true,
    gzip: true
};

gulp.task('bower', function() {
  gulp.src('index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
});

gulp.task('tsc', function() {
  return gulp.src(config.ts)
    .pipe(plugins.sourcemaps.init())
    .pipe(config.tsProject())
    .js
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('.'));
});

gulp.task('tslint', function(){
  gulp.src(config.ts)
    .pipe(tslint(config.tsLintOptions))
    .pipe(tslint.report('verbose'));
});

gulp.task('tslint-watch', function(){
  gulp.src(config.ts)
    .pipe(tslint(config.tsLintOptions))
    .pipe(tslint.report('prose', {
      emitError: false
    }));
});

gulp.task('less', function () {
  return gulp.src(config.less)
    .pipe(plugins.less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(plugins.concat(config.css))
    .pipe(gulp.dest('./dist'));
});

gulp.task('template', ['tsc'], function() {
  return gulp.src(config.templates)
    .pipe(plugins.angularTemplatecache({
      filename: 'templates.js',
      root: 'plugins/',
      standalone: true,
      module: config.templateModule,
      templateFooter: '}]); hawtioPluginLoader.addModule("' + config.templateModule + '");'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('concat', ['template'], function() {
  var gZipSize = size(gZippedSizeOptions);
  var license = tslintRules.rules['license-header'][1];
  return gulp.src(['compiled.js', 'templates.js'])
    .pipe(plugins.concat(config.js))
    .pipe(plugins.ngAnnotate())
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean', ['concat'], function() {
  return del(['templates.js', 'compiled.js']);
});

gulp.task('watch-less', function() {
  plugins.watch(config.less, function() {
    gulp.start('less');
  });
});

gulp.task('watch', ['build', 'watch-less'], function() {
  plugins.watch(['libs/**/*.js', 'libs/**/*.css', 'index.html', urljoin(config.dist, config.js), urljoin(config.dist, config.css)], function() {
    gulp.start('reload');
  });
  plugins.watch(['libs/**/*.d.ts', config.ts, config.templates], function() {
    gulp.start(['tslint-watch', 'tsc', 'template', 'concat', 'clean']);
  });
});

function configStaticAssets(prefix) {
  var staticAssets = [{
      path: '/',
      dir: prefix
  }];
  var targetDir = urljoin(prefix, 'libs');
  try {
    if (fs.statSync(targetDir).isDirectory()) {
      var dirs = fs.readdirSync(targetDir);
      dirs.forEach(function(dir) {
        dir = urljoin(prefix, 'libs', dir);
        console.log("dir: ", dir);
        if (fs.statSync(dir).isDirectory()) {
          console.log("Adding directory to search path: ", dir);
          staticAssets.push({
            path: '/',
            dir: dir
          });
        }
      });
    }
  } catch (err) {
    console.log("Nothing in libs to worry about");
  }
  return staticAssets;
}

gulp.task('serve-site', function() {
  var staticAssets = configStaticAssets('site');
  hawtio.setConfig({
    port: 2772,
    staticProxies: [
    {
      port: 8282,
      path: '/jolokia',
      targetPath: '/hawtio/jolokia'
    }
    ],
    staticAssets: staticAssets,
    fallback: 'site/404.html',
    liveReload: {
      enabled: false
    }
  });
  return hawtio.listen(function(server) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("started from gulp file at ", host, ":", port);
  });
});

gulp.task('connect', ['watch', 'collect-dep-versions'], function() {
  /*
   * Example of fetching a URL from the environment, in this case for kubernetes
  var kube = uri(process.env.KUBERNETES_MASTER || 'http://localhost:8080');
  console.log("Connecting to Kubernetes on: " + kube);
  */
  var staticAssets = configStaticAssets('.');
  hawtio.setConfig({
    port: 2772,
    staticProxies: [
    {
      port: 8282,
      path: '/jolokia',
      targetPath: '/hawtio/jolokia'
    }
    ],
    staticAssets: staticAssets,
    fallback: 'index.html',
    liveReload: {
      enabled: true
    }
  });
  hawtio.use('/version.json', function(req, res, next) {
    var answer = getVersionString();
    res.set('Content-Type', 'application/javascript');
    res.send(answer);
  });
  return hawtio.listen(function(server) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("started from gulp file at ", host, ":", port);
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(hawtio.reload());
});

// 'site' tasks
gulp.task('site-fonts', function() {
  return gulp.src(['libs/**/*.woff', 'libs/**/*.woff2', 'libs/**/*.ttf', 'libs/**/fonts/*.eot', 'libs/**/fonts/*.svg'], { base: '.' })
    .pipe(plugins.flatten())
    .pipe(plugins.chmod(0o644))
    .pipe(plugins.dedupe({ same: false }))
    .pipe(plugins.debug({title: 'site font files'}))
    .pipe(gulp.dest('site/fonts/', { overwrite: false }));
});

gulp.task('swf', function() {
  return gulp.src(['libs/**/*.swf'], { base: '.' })
    .pipe(plugins.flatten())
    .pipe(plugins.chmod(0o644))
    .pipe(plugins.dedupe({ same: false }))
    .pipe(plugins.debug({title: 'swf files'}))
    .pipe(gulp.dest('site/img/', { overwrite: false }));
});

gulp.task('root-files', ['swf'], function() {
  return gulp.src(['favicon.ico'], { base: '.' })
    .pipe(plugins.flatten())
    .pipe(plugins.debug({title: 'root files'}))
    .pipe(plugins.chmod(0o644))
    .pipe(gulp.dest('site'));
})

gulp.task('site-files', ['root-files', 'site-fonts'], function() {
  return gulp.src(['images/**', 'img/**'], {base: '.'})
    .pipe(plugins.chmod(0o644))
    .pipe(plugins.dedupe({ same: false }))
    .pipe(plugins.debug({title: 'site images'}))
    .pipe(gulp.dest('site'));
});

gulp.task('usemin', ['site-files'], function() {
  return gulp.src('index.html')
    .pipe(plugins.usemin({
      css: [
        plugins.dos2unix(),
        plugins.cleanCss({keepBreaks: true}),
        'concat'
      ],
      js: [
        plugins.uglify(),
        plugins.rev(),
      ],
      js1: [
        plugins.uglify(),
        plugins.rev(),
      ]
    }))
    .pipe(plugins.debug({title: 'usemin'}))
    .pipe(gulp.dest('site'));
});

gulp.task('tweak-urls', ['usemin'], function() {
  return gulp.src('site/style.css')
    .pipe(plugins.replace(/url\(\.\.\//g, 'url('))
    // tweak fonts URL coming from PatternFly that does not repackage then in dist
    .pipe(plugins.replace(/url\(\.\.\/components\/font-awesome\//g, 'url('))
    .pipe(plugins.replace(/url\(\.\.\/components\/bootstrap\/dist\//g, 'url('))
    .pipe(plugins.replace(/url\(libs\/bootstrap\/dist\//g, 'url('))
    .pipe(plugins.replace(/url\(libs\/patternfly\/components\/bootstrap\/dist\//g, 'url('))
    .pipe(plugins.debug({title: 'tweak-urls'}))
    .pipe(gulp.dest('site'));
});

gulp.task('404', ['usemin', 'site-files'], function() {
  return gulp.src('site/index.html')
    .pipe(plugins.rename('404.html'))
    .pipe(gulp.dest('site'));
});

gulp.task('copy-images', ['404', 'tweak-urls'], function() {
  var dirs = fs.readdirSync('./libs');
  var patterns = [];
  dirs.forEach(function(dir) {
    var path = './libs/' + dir + "/img";
    try {
      if (fs.statSync(path).isDirectory()) {
        console.log("found image dir: " + path);
        var pattern = 'libs/' + dir + "/img/**";
        patterns.push(pattern);
      }
    } catch (e) {
      // ignore, file does not exist
    }
  });
  // Add PatternFly images package in dist
  patterns.push('libs/patternfly/dist/img/**');
  return gulp.src(patterns)
           .pipe(plugins.debug({ title: 'img-copy' }))
           .pipe(plugins.chmod(0o644))
           .pipe(gulp.dest('site/img'));
});

gulp.task('collect-dep-versions', ['get-commit-id'], function() {
  return gulp.src('./libs/**/.bower.json')
          .pipe(plugins.foreach(function(stream, file) {
            var pkg = JSON.parse(file.contents.toString('utf8'));
            bower.packages[pkg.name] = {
              version: pkg.version
            };
            return stream;
          }));
});

gulp.task('get-commit-id', function(cb) {
  plugins.git.exec({ args: 'rev-parse HEAD'}, function(err, stdout) {
    bower.commitId = stdout.trim();
    cb();
  });
});

gulp.task('write-version-json', ['site-files', 'collect-dep-versions'], function(cb) {
  fs.writeFile('site/version.json', getVersionString(), cb);
});


gulp.task('deploy', function(cb) {
  ghPages.publish(
    path.join(__dirname, 'site'),
    {
      clone: '.publish',
      branch: 'builds',
      tag: 'v' + bower.version + '-build',
      message: "[ci skip] Update site",
      push: true,
      logger: function(message) {
        console.log(message);
      }
    }, cb);
});

gulp.task('site', ['site-fonts', 'swf', 'root-files', 'site-files', 'usemin', 'tweak-urls', '404', 'copy-images', 'write-version-json']);

gulp.task('build', ['bower', 'tslint', 'tsc', 'less', 'template', 'concat', 'clean']);

gulp.task('default', ['connect']);
