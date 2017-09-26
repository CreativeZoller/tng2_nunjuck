'use strict';
var del = require('del');

module.exports = function (gulp, gConfig, plugins) {

  // -------------------------------------
  //   Task: Clear: Everything
  // -------------------------------------
  gulp.task('clean', function() {
  	del(['.tmp/**','./_dist/**','./_prod/**']);
  });

};
