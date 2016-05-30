/**
 * Created by andrey on 26.05.2016.
 */

"use strict";

define(function () {
    var userModel = function Users(a) {
        var args = a || {};

        this.email = args.email || '';
        this.name = args.name || '';
        this.password = args.password || '';
    };

    var animalModel = function Animals(a) {
        var args = a || {};

        this.email = args.email || '';
        this.password = args.password || '';
    };
    
    return {
        user  : userModel,
        animal: animalModel
    }
});