'use strict';

define([
    'Backbone', 'jQuery', 'Underscore', 'Jcrop'

], function (Backbone, $, _, Jcrop) {

    var canvasDraw = function (options, callback) {
        var inputFile = options.inputFile;
        var parts = $(inputFile).val().split('.');
        var aspectRatio = options.aspectRatio || null;

        function imgSelect(coordinates) {
            var canvasCrop;
            var ctx;
            var img;
            var src;

            if (parseInt(coordinates.w, 10) > 0) {
                img = $('.styleImage')[0];

                canvasCrop = document.createElement('canvas');
                canvasCrop.height = 600;
                canvasCrop.width = 600;
                ctx = canvasCrop.getContext('2d');
                ctx.drawImage(img, coordinates.x, coordinates.y, coordinates.w, coordinates.h, 0, 0, canvasCrop.width, canvasCrop.height);
                src = canvasCrop.toDataURL('images/' + parts[1]);
            }

            callback(null, src);
        }

        $('.styleImage').Jcrop({
            aspectRatio: aspectRatio,
            setSelect  : [0, 0, 200, 200],
            onSelect   : imgSelect,
            onChange   : imgSelect,
            boxWidth   : 550,
            boxHeight  : 550,
            minSize    : [50, 50]
        });
    };

    var getSrc = function (event, type, callback) {
        event.preventDefault();

        var _type = type;
        var inputFile = $(event.target)[0];
        var file = inputFile.files[0];
        var filesExt = TYPE[_type];
        var parts = $(inputFile).val().split('.');
        var ext = parts[parts.length - 1].toLowerCase();
        var fr;

        if (filesExt.join().search(ext) !== -1) {
            fr = new FileReader();
            fr.onload = function () {
                var src = fr.result;

                if (callback && (typeof callback === 'function')) {
                    callback(null, src);
                }
            };
            fr.readAsDataURL(file);
        } else {
            if (callback && (typeof callback === 'function')) {
                callback('Invalid file type');
            }
        }
    };

    return {
        canvasDraw: canvasDraw,
        getSrc    : getSrc
    };
});