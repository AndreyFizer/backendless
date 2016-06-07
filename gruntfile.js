/**
 * Created by andrey on 06.06.2016.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        
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
                files: 'public/sass/**/*.scss',
                tasks: ['sass', 'notify'],
                options: {
                    debounceDelay: 1000
                }
            }
        },
        
        notify: {
            sass: {
                options: {
                    title  : 'SCSS to CSS',
                    message: 'main.css successfully generated...'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-notify');
    
    grunt.registerTask('default', ['sass', 'notify', 'watch']);
};