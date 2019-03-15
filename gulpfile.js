const gulp = require('gulp');
const wiredep = require('wiredep').stream;
const eventStream = require('event-stream');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const fs = require('fs');
const path = require('path');
const size = require('gulp-size');
const hawtio = require('@hawtio/node-backend');
const urljoin = require('urljoin');
const tslint = require('gulp-tslint');
const ghPages = require('gh-pages');
const tslintRules = require('./tslint.json');
const plugins = gulpLoadPlugins({});
const pkg = require('./package.json');
const bower = require('./bower.json');
bower.packages = {};

function getVersionString() {
  return JSON.stringify({
    name: bower.name,
    version: bower.version,
    commitId: bower.commitId,
    packages: bower.packages
  }, undefined, 2);
}

const config = {
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
  tsProject: plugins.typescript.createProject('tsconfig.json')
};

const normalSizeOptions = {
  showFiles: true
};

const gZippedSizeOptions = {
  showFiles: true,
  gzip: true
};

gulp.task('bower', function () {
  gulp.src('index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('.'));
});

gulp.task('tsc', function () {
  var cwd = process.cwd();
  var tsResult = gulp.src(config.ts)
    .pipe(config.tsProject());

  return eventStream.merge(
    tsResult.js
      .pipe(plugins.concat('compiled.js'))
      .pipe(gulp.dest('.')),
    tsResult.dts
      .pipe(gulp.dest('d.ts')))
    .pipe(plugins.filter('**/*.d.ts'))
    .pipe(plugins.concatFilenames('defs.d.ts', {
      root: cwd,
      prepend: '/// <reference path="',
      append: '"/>'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('tslint', function () {
  gulp.src(config.ts)
    .pipe(tslint({
      rulesDirectory: './tslint-rules/',
      formatter: 'verbose'
    }))
    .pipe(tslint.report({
      emitError: false
    }));
});

gulp.task('tslint-watch', function () {
  gulp.src(config.ts)
    .pipe(tslint({
      rulesDirectory: './tslint-rules/',
      formatter: 'prose'
    }))
    .pipe(tslint.report({
      emitError: false
    }));
});

gulp.task('less', function () {
  return gulp.src(config.less)
    .pipe(plugins.less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(plugins.concat(config.css))
    .pipe(gulp.dest('./dist'));
});

gulp.task('template', ['tsc'], function () {
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

gulp.task('concat', ['template'], function () {
  var gZipSize = size(gZippedSizeOptions);
  var license = tslintRules.rules['license-header'][1];
  return gulp.src(['compiled.js', 'templates.js'])
    .pipe(plugins.concat(config.js))
    .pipe(plugins.ngAnnotate())
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean', ['concat'], function () {
  return del(['templates.js', 'compiled.js']);
});

gulp.task('watch-less', function () {
  gulp.watch(config.less, ['less']);
});

gulp.task('watch', ['build', 'watch-less'], function () {
  gulp.watch(['libs/**/*.js', 'libs/**/*.css', 'index.html', urljoin(config.dist, config.js), urljoin(config.dist, config.css)], ['reload']);
  gulp.watch(['libs/**/*.d.ts', config.ts, config.templates], ['tslint-watch', 'tsc', 'template', 'concat', 'clean']);
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
      dirs.forEach(function (dir) {
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

gulp.task('serve-site', function () {
  var staticAssets = configStaticAssets('site');
  hawtio.setConfig({
    port: 2772,
    staticProxies: [
      {
        port: 8778,
        path: '/jolokia',
        targetPath: '/jolokia'
      }
    ],
    staticAssets: staticAssets,
    fallback: 'site/404.html',
    liveReload: {
      enabled: false
    }
  });
  return hawtio.listen(function (server) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("started from gulp file at ", host, ":", port);
  });
});

gulp.task('connect', ['watch', 'collect-dep-versions'], function () {
  var staticAssets = configStaticAssets('.');
  hawtio.setConfig({
    port: 2772,
    staticProxies: [
      {
        port: 10001,
        path: '/jolokia',
        targetPath: '/jolokia'
      }
    ],
    staticAssets: staticAssets,
    fallback: 'index.html',
    liveReload: {
      enabled: true
    }
  });
  hawtio.use('/version.json', function (req, res, next) {
    var answer = getVersionString();
    res.set('Content-Type', 'application/javascript');
    res.send(answer);
  });
  return hawtio.listen(function (server) {
    var host = server.address().address;
    var port = server.address().port;
    console.log("started from gulp file at ", host, ":", port);
  });
});

gulp.task('reload', function () {
  gulp.src('.')
    .pipe(hawtio.reload());
});

// 'site' tasks
gulp.task('site-fonts', function () {
  return gulp.src(['libs/**/*.woff', 'libs/**/*.woff2', 'libs/**/*.ttf', 'libs/**/fonts/*.eot', 'libs/**/fonts/*.svg'], { base: '.' })
    .pipe(plugins.flatten())
    .pipe(plugins.chmod(0o644))
    .pipe(plugins.dedupe({ same: false }))
    .pipe(plugins.debug({ title: 'site font files' }))
    .pipe(gulp.dest('site/fonts/', { overwrite: false }));
});

gulp.task('swf', function () {
  return gulp.src(['libs/**/*.swf'], { base: '.' })
    .pipe(plugins.flatten())
    .pipe(plugins.chmod(0o644))
    .pipe(plugins.dedupe({ same: false }))
    .pipe(plugins.debug({ title: 'swf files' }))
    .pipe(gulp.dest('site/img/', { overwrite: false }));
});

gulp.task('root-files', ['swf'], function () {
  return gulp.src(['favicon.ico'], { base: '.' })
    .pipe(plugins.flatten())
    .pipe(plugins.debug({ title: 'root files' }))
    .pipe(plugins.chmod(0o644))
    .pipe(gulp.dest('site'));
})

gulp.task('site-files', ['root-files', 'site-fonts'], function () {
  return gulp.src(['images/**', 'img/**'], { base: '.' })
    .pipe(plugins.chmod(0o644))
    .pipe(plugins.dedupe({ same: false }))
    .pipe(plugins.debug({ title: 'site images' }))
    .pipe(gulp.dest('site'));
});

gulp.task('usemin', ['site-files'], function () {
  return gulp.src('index.html')
    .pipe(plugins.usemin({
      css: [
        plugins.dos2unix(),
        plugins.cleanCss({ format: 'keep-breaks' }),
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
    .pipe(plugins.debug({ title: 'usemin' }))
    .pipe(gulp.dest('site'));
});

gulp.task('tweak-urls', ['usemin'], function () {
  return gulp.src('site/style.css')
    .pipe(plugins.replace(/url\(\.\.\//g, 'url('))
    .pipe(plugins.replace(/url\(\.\.\/\.\.\/patternfly\/dist\//g, 'url('))
    .pipe(plugins.replace(/url\(\.\.\/\.\.\/hawtio-ui\/dist\//g, 'url('))
    .pipe(plugins.replace(/url\(\.\.\/\.\.\/hawtio-ui\//g, 'url('))
    // tweak fonts URL coming from PatternFly that does not repackage then in dist
    .pipe(plugins.replace(/url\(\.\.\/components\/font-awesome\//g, 'url('))
    .pipe(plugins.replace(/url\(\.\.\/components\/bootstrap\/dist\//g, 'url('))
    .pipe(plugins.replace(/url\(libs\/bootstrap\/dist\//g, 'url('))
    .pipe(plugins.replace(/url\(libs\/patternfly\/components\/bootstrap\/dist\//g, 'url('))
    .pipe(plugins.debug({ title: 'tweak-urls' }))
    .pipe(gulp.dest('site'));
});

gulp.task('404', ['usemin', 'site-files'], function () {
  return gulp.src('site/index.html')
    .pipe(plugins.rename('404.html'))
    .pipe(gulp.dest('site'));
});

gulp.task('copy-images', ['404', 'tweak-urls'], function () {
  var dirs = fs.readdirSync('./libs');
  var patterns = [];
  dirs.forEach(function (dir) {
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
  // Add Dynatree icons
  patterns.push('libs/jquery.dynatree/dist/skin/icons.gif');
  return gulp.src(patterns)
    .pipe(plugins.debug({ title: 'img-copy' }))
    .pipe(plugins.chmod(0o644))
    .pipe(gulp.dest('site/img'));
});

gulp.task('collect-dep-versions', ['get-commit-id'], function () {
  return gulp.src('./libs/**/.bower.json')
    .pipe(plugins.foreach(function (stream, file) {
      var pkg = JSON.parse(file.contents.toString('utf8'));
      bower.packages[pkg.name] = {
        version: pkg.version
      };
      return stream;
    }));
});

gulp.task('get-commit-id', function (cb) {
  plugins.git.exec({ args: 'rev-parse HEAD' }, function (err, stdout) {
    bower.commitId = stdout.trim();
    cb();
  });
});

gulp.task('write-version-json', ['site-files', 'collect-dep-versions'], function (cb) {
  fs.writeFile('site/version.json', getVersionString(), cb);
});


gulp.task('deploy', function (cb) {
  ghPages.publish(
    path.join(__dirname, 'site'),
    {
      clone: '.publish',
      branch: 'builds',
      tag: 'v' + bower.version + '-build',
      message: "[ci skip] Update site",
      push: true,
      logger: function (message) {
        console.log(message);
      }
    }, cb);
});

gulp.task('site', ['site-fonts', 'swf', 'root-files', 'site-files', 'usemin', 'tweak-urls', '404', 'copy-images', 'write-version-json']);

gulp.task('build', ['bower', 'tslint', 'tsc', 'less', 'template', 'concat', 'clean']);

gulp.task('default', ['connect']);
