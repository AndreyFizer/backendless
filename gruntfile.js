/**
 * Created by andrey on 06.06.2016.
 */

module.exports = function(grunt) {
    grunt.initConfig({
        
        concat: {
            dist: {
                src : [
                    'public/sass/*.scss'
                ],
                dest: 'public/sass/main.scss'
            }
        },
        
        sass: {
            options: {
                sourceMap: true
            },
            dist   : {
                files: {
                    'public/css/main.css': 'public/sass/main.scss'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-notify');
    
    grunt.registerTask('default', ['concat', 'sass']);
};