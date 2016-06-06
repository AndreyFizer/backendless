// Created by andrey on 12.05.16.

'use strict';

var APP = APP || {};

require.config({
    shim : {
        Underscore: {
            exports: '_'
        },

        jQuery: {
            exports: '$'
        },

        Backendless: {
            exports: 'Backendless'
        },
        Backbone   : {
            deps   : [
                'Underscore',
                'jQueryUI'
            ],
            exports: 'Backbone'
        },

        toastr: {
            deps   : ['jQuery'],
            exports: 'toastr'
        },

        jQueryUI: {
            deps: ['jQuery']
        }
    },
    paths: {
        jQuery     : '../js/libs/jquery/jquery',
        jQueryUI   : '../js/libs/jquery-ui/jquery-ui.min',
        Underscore : '../js/libs/underscore/underscore',
        Backbone   : '../js/libs/backbone/backbone',
        Backendless: '../js/libs/backendless/libs/backendless',
        async      : '../js/libs/async/dist/async.min',
        toastr     : '../js/libs/toastr/toastr',
        text       : '../js/libs/requirejs-text/text',
        views      : './views',
        collections: './collections',
        templates  : '../templates'
    }
});

require([
    'app',
    'Backendless',
    'const'

], function (app, Backendless, CONST) {
    var APP_ID = CONST.BL_CREDENTIALS.APPLICATION_ID;
    var SECRET_KEY = CONST.BL_CREDENTIALS.SECRET_KEY;
    var VERSION = CONST.BL_CREDENTIALS.VERSION;

    Backendless.initApp(APP_ID, SECRET_KEY, VERSION);

    app.init();
});