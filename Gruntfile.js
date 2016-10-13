module.exports = function ( grunt ) {
   // load NPM tasks
   [
      'grunt-contrib-copy',
      'grunt-contrib-uglify',
      'grunt-rsync',
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
      copy     : {
         release  : {
            files    : [{
               expand   : true,
               cwd      : 'project',
               dest     : 'build',
               src      : ['*.html']
            }]
         }
      },
      uglify   : {
         my_target   : {
            files : [{
               expand   : true,
               cwd      : 'project/Scripts',
               src      : '**/*.js',
               dest     : 'build/Scripts'
            }]
         }
      },
      rsync    : {
         options  : {
            args        : [
               '--verbose',
               /*"-e 'ssh -p 2222'"*/  // uncomment this line to use a different port than the default 22
            ],
            recursive   : true
         },
         prod     : {
            options     : {
               src         : 'build/',
               dest        : '~/public_html/grunt-tutorial',
               host        : 'user@livehost.com'
            }
         }
      },
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
            files    : [{
               expand   : true,
               cwd      : 'project/sass/',      // current working directory
               dest     : 'project/css/',
               src      : '**/*.{sass, scss}',
               ext      : '.css'
            }]
         },
         // sub-task
         prod     : {
            options  : {
               style          : 'compressed'
            },
            files    : [{
               expand   : true,
               cwd      : 'project/sass/',      // current working directory
               dest     : 'build/css/',
               src      : '**/*.{sass, scss}',
               ext      : '.css'
            }]
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
   grunt.registerTask('build', 'Create a build, minimize files', [
      'sass:prod',
      'copy',
      'uglify'
   ]);
   grunt.registerTask('deploy', 'Deploy latest build on production', [
      'build',
      'rsync'
   ]);
};
