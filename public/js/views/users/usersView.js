/**
 * Created by andrey on 01.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'views/users/userItemView',
    'text!templates/users/usersTemp.html',
    'text!templates/users/userItemTemp.html'

], function ($, _, Backbone,  Backendless, DialogView, MainTemp, UstItemTemp) {

    return Backbone.View.extend({
        el: '#wrapper',
        
        template: _.template(MainTemp),
        usrItm  : _.template(UstItemTemp),
        
        initialize: function () {
            this.render();
        },

        events: {
            'click .usrEditBtn': 'letsEditUser'
        },

        letsEditUser: function (ev) {
            ev.stopPropagation();

            var userId    = this.$el.find(ev.target).closest('.usrItem').attr('id');
            var userModel = this.collection.get(userId);

            this.dialogView = new DialogView({ model: userModel });
            this.dialogView.on('userAction', this.userAction, this)
        },

        userAction: function (data) {
            var isNew    = data.isNew || false;
            var userData = data.model || { };
            var $userRow;
            var userId;

            if (isNew){
                userId = userData.objectId;

                // update model in user's collection
                this.collection.get(userId).set(userData);

                // render updated user's props
                $userRow = this.$el.find('#'  + userId);
                $userRow.find('.userFirstName').text(userData.firstName || '');
                $userRow.find('.userLastName').text(userData.lastName || '');
                $userRow.find('.userEmail').text(userData.email || '');
            }
        },
        
        renderUsers: function () {
            var usersData = this.collection.toJSON();
            var $container = this.$el.find('#usrContainer').html('');

            usersData.forEach(function (usr) {
                $container.append(this.usrItm(usr));
            }.bind(this));
        },
        
        render: function () {
            this.$el.html(this.template());
            this.renderUsers();
            
            return this;
        }
    });
});