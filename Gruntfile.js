module.exports = function ( grunt ) {
   // load NPM tasks
   [
      'grunt-contrib-jshint'
   ].forEach( function ( name ) {
      this.loadNpmTasks( name );
   }, grunt );
   // init configuration
   grunt.initConfig({
      jshint   : {
         all      : [
            'Gruntfile.js'
         ]
      }
   });
};