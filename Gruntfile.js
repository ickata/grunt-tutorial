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
      'grunt-contrib-jasmine',
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
      jasmine  : {
         shell    : {
            options  : {
               specs    : ['tests/**/*.js'],
               vendor   : ['project/Scripts/lib/**/*.js']
            },
            src      : ['project/Scripts/**/*.js', '!project/Scripts/lib/**/*.js']
         }
      },
      connect  : {
         server   : {
            options  : {
               port        : 9000,
               middleware  : function ( connect ) {
                  var path = require('path');
                  return [
                     connect.static( path.resolve('project') )
                  ];
               }
            }
         }
      },
      open     : {
         server   : {
            path     : 'http://localhost:9000'
         }
      },
      watch    : {
         sass     : {
            files    : ['project/sass/*.{sass,scss}'],
            tasks    : ['sass:dev']
         },
         app      : {
            files    : ['project/**/*.*'],
            tasks    : ['open:server']
         }
      },
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
   // custom tasks
   grunt.registerTask('livereload', 'Starts a server & opens the browser', [
      'connect',
      'open',
      'watch'
   ]);
   grunt.registerTask('test', 'Code linting & unit testing', [
      'jshint',
      'jasmine'
   ]);
};