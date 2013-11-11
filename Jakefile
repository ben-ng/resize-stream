var t = new jake.TestTask('resize-stream', function () {
  var files = [
    'tests/*'
  ];
  this.testFiles.include(files);
  this.testFiles.exclude('tests/fixtures');
});

var d = new jake.NpmPublishTask('resize-stream', function () {
  this.packageFiles.include([
    'index.js'
  , 'package.json'
  , 'Readme.md'
    ]);
  this.packageFiles.exclude([
  ]);
  this.publishCmd = 'fury push %filename';
});
