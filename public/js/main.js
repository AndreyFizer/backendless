'use strict';

var APP = APP || {};

require.config({
    shim : {
        Underscore : {
            exports: '_'
        },

        jQuery : {
            exports: '$'
        },

        Backbone   : {
            deps   : ['Underscore', 'jQuery'],
            exports: 'Backbone'
        },

        toastr: {
            deps   : ['jQuery'],
            exports: 'toastr'
        },

        Backendless: {
            exports: 'Backendless'
        },

        jQueryUI   : {
            deps   : ['jQuery']
        }
    },
    paths: {
        Backendless: '../js/libs/backendless/libs/backendless.min',
        Underscore : '../js/libs/underscores/underscore',
        Backbone   : '../js/libs/backbone/backbone',
        jQueryUI   : '../js/libs/jquery-ui/jquery-ui.min',
        jQuery     : '../js/libs/jquery/jquery',
        toastr     : '../js/libs/toastr/toastr',
        text       : '../js/libs/requirejs-text/text',

        messenger  : '../js/helpers/messenger',
        validator  : '../js/helpers/validator',

        collections: './collections',
        templates  : '../templates',
        views      : './views'
    }
});

require([
    'app',
    'const',
    'Backendless'
], function (app, CONST, Backendless) {
    var SECRET_KEY = CONST.BL_CREDENTIALS.SECRET_KEY;
    var VERSION = CONST.BL_CREDENTIALS.VERSION;
    var APP_ID = CONST.BL_CREDENTIALS.APPLICATION_ID;

    Backendless.initApp(APP_ID, SECRET_KEY, VERSION);
    
    app.init();
});