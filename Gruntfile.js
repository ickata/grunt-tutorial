module.exports = function ( grunt ) {
   // load NPM tasks
   [
      'grunt-contrib-copy',
      'grunt-contrib-uglify',
      'grunt-contrib-compress',
      'grunt-ssh',
      'grunt-contrib-clean',
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
      compress : {
         release  : {
            options  : {
               archive  : 'project.tar.gz'
            },
            files    : [{
               expand   : true,
               cwd      : 'build',
               src      : ['**/*']
            }]
         }
      },
      sshconfig: {
         prod  : grunt.file.readJSON('sshconfig.json')
      },
      sftp     : {
         deploy   : {
            files    : {
               './'  : ['project.tar.gz']
            },
            options  : {
               path           : '/home/ickata/public_html/',
               srcBaseDir     : 'project/',
               config         : 'prod',
               port           : 23,
               agent          : process.env.SSH_AUTH_SOCK
            }
         }
      },
      sshexec  : {
         untar    : {
            command  : [
               'rm -rf /home/ickata/public_html/grunt-tutorial/',
               'mkdir /home/ickata/public_html/grunt-tutorial/',
               'cd /home/ickata/public_html/grunt-tutorial/',
               'tar -zxvf ../project.tar.gz',
               'rm ../project.tar.gz'
            ].join(' && '),
            options  : {
               config   : 'prod',
               port     : 23
            }
         }
      },
      clean    : {
         all      : [ 'build', '*.tar.gz' ]
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
   grunt.registerTask('build', 'Create a build, compress files', [
      'clean',
      'sass:prod',
      'copy',
      'uglify',
      'compress'
   ]);
   grunt.registerTask('deploy', 'Deploy latest build on production', [
      'build',
      'sftp',
      'sshexec'
   ]);
};