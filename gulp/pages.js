var gulp = require('gulp'),
  panini = require('panini'),
  fs = require('fs'),
  markdown = require('gulp-markdown'),
  marked = require('marked'),
  renderer = new marked.Renderer(),
  exec = require('child_process').exec,
  config = require('./config');

gulp.task('markdown', function() { 

  var _code = renderer.code;
  renderer.code = function(code, lang) {
    if (lang === 'config') return '---\n' + code + '\n---\n';
    else return _code.apply(renderer, [code, lang]);
  }
  renderer.hr = function() {
    return '';
  };
  renderer.heading = function (text, level) {
    if (text.indexOf('title:') === 0) { // YAML config
      return '---\n' + text + '\n---\n';
    }
    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return '<h' + level + '><a class="anchor" href="#' + escapedText + '"><span class="header-link"></span></a>' + text + '</h' + level + '>';
  }

  return gulp.src(config.srcPath + 'pages/**/*.md')
    .pipe(markdown({
      renderer: renderer,
      highlight: function (code, lang) {
        if (lang === 'config') return code;
        return require('highlight.js').highlight(lang, code).value;
      }
    }))
    .pipe(gulp.dest(config.buildPath + 'pages/'));
});

gulp.task('pages', ['markdown', 'index'], function() {
  return gulp.src(config.buildPath + 'pages/**/*.html')
    .pipe(panini({
      root: config.buildPath + 'pages/',
      layouts: config.srcPath + 'layouts/',
      partials: config.srcPath + 'partials/',
      helpers: config.srcPath + 'helpers/',
      data: config.buildPath + 'data/'
    }))
    .pipe(gulp.dest(config.destPath));
});


gulp.task('index', ['markdown'], function(cb) {
  fs.readdir(config.buildPath + 'pages/posts/', function(err, filenames) {
    var posts = [],
      allTags = {};
    filenames.forEach(function(filename) {
      var content = fs.readFileSync(config.buildPath + '/pages/posts/' + filename, 'utf-8'),
        data = /---((\n.*)*)---\n*<p>(.*)/.exec(content),
        yaml = data[1],
        teaser = data[3],
        lines = yaml.split('\n'),
        post = {};
      for (var i = 1; i < lines.length; i++) { // parse each line
        var columns = lines[i].split(/:\s*/),
          key = columns[0],
          value = columns[1];
        
        if (key === 'tags') { // gather tags
          var tags = [];
          while (/\s*\-/.exec(lines[++i])) {
            tags.push(lines[i].replace(/\s*-\s*/,''));
          }
          for (var t in tags) {
            var tag = tags[t];
            if (allTags[tag]) {
              allTags[tag].count++;
            } else {
              allTags[tag] = {count: 1};
            }
          }
          value = tags;
        }
        post[key] = value;
      }
      post.teaser = teaser;
      posts.push(post);
    });

    // sort posts by date
    posts.sort(function(a, b) {
      return new Date(a.published) < new Date(b.published)
    });

    var _prev;
    for (var p in posts) {
      var post = posts[p];
      if (!_prev) {
        _prev = post;
      } else {
        // deep cloning to avail circular references
        post.prev = JSON.parse(JSON.stringify(_prev));
        _prev.next = JSON.parse(JSON.stringify(post));
      }

    }
    console.log('Found ' + posts.length + ' posts.');
    // write data to file
    exec('mkdir -pv _build/data', function(error, stdout, stderr) {
      console.log(stdout);
      fs.writeFileSync(config.buildPath + 'data/posts.json', JSON.stringify(posts));
      fs.writeFileSync(config.buildPath + 'data/allTags.json', JSON.stringify(allTags));
      cb();
    });
  });
});