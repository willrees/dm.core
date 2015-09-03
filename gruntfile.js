module.exports = function (grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
       
        concat: {
            dist: {
                src: [                    
                    'scripts/src/dm.core.js',
                    'scripts/src/dm.List.js',
                    'scripts/src/dm.featureDetection.js',
                    'scripts/src/dm.http.js',
                    'scripts/src/dm.utilities.js',
                    'scripts/src/dm.dataApi.js'
                ],
                dest: 'scripts/dist/dm.core.js',
            }
        },
        uglify: {
            dist: {
                files: {
                    'scripts/dist/dm.core.min.js': 'scripts/dist/dm.core.js'
                }
            }
        },               
        watch: {
            scripts: {
                files: ['scripts/**/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false
                },
            }
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');        
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['less','concat', 'uglify']);
};
