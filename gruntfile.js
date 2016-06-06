/**
 * Created by andrey on 06.06.2016.
 */

grunt.initConfig({
    sass: {
        dist: {
            files: [{
                // expand: true,
                // cwd: 'styles',
                // src: ['*.scss'],
                // dest: '../public',
                // ext: '.css'
            }]
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-notify');

grunt.registerTask('default', ['sass']);