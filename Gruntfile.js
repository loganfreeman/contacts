
module.exports = function(grunt) {

    require( 'load-grunt-tasks' )( grunt );

    // Time how long tasks take. Can help when optimizing build times
    require( 'time-grunt' )( grunt );


    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),

        // Project settings
        yeoman: {
            // configurable paths
            app: require( './bower.json' ).appPath || 'app',
            dist: 'dist'
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: '<%= yeoman.app %>/',
                exclude: [
                ]
            }
        },


        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/**/*.js']
            }
        },



        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug']
                }
            }
        },


    


    } );

    grunt.registerTask( 'test', ['mochaTest:test'] );




};