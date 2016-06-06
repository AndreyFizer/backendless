/**
 * Created by andrey on 06.06.2016.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        
        // concat: {
        //     dist: {
        //         src : [
        //             'public/sass/*.scss'
        //         ],
        //         dest: 'public/sass/main.scss'
        //     }
        // },
        
        sass: {
            options: {
                sourceMap: true
            },
            dist   : {
                files: {
                    'public/css/main.css': 'public/sass/main.scss'
                }
            }
        },
        
        watch: {
            sass: {
                files: 'public/sass/main.scss',
                tasks: ['sass']
            }
        }
    });
    
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-notify');
    
    grunt.registerTask('default', ['sass', 'watch:sass']);
};