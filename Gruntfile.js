module.exports = function ( grunt ) {
   // globals
   var sass_files = [{
      expand   : true,
      cwd      : 'project/sass/',      // current working directory
      dest     : 'project/css/',
      src      : '**/*.{sass, scss}',
      ext      : '.css'
   }];
   // load NPM tasks
   [
      'grunt-contrib-connect',
      'grunt-contrib-watch',
      'grunt-open',
      'grunt-contrib-sass',
      'grunt-contrib-jshint'
   ].forEach( function ( name ) {
      this.loadNpmTasks( name );
   }, grunt );
   // init configuration
   grunt.initConfig({
      sass     : {
         options  : {
            cacheLocation  : '.tmp/.sass-cache'
         },
         // sub-task
         dev      : {
            options  : {
               style          : 'expanded',
               lineComments   : true
            },
            files    : sass_files
         },
         // sub-task
         prod     : {
            options  : {
               style          : 'compressed'
            },
            files    : sass_files
         }
      },
      jshint   : {
         all      : [
            'Gruntfile.js',
            'project/Scripts/**/*.js',       // "/**/" means recursively
            '!project/Scripts/lib/**/*.js'   // "!" means exclude
         ]
      }
   });
};