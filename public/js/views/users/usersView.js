/**
 * Created by andrey on 01.06.16.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'views/users/userItemView',
    'text!templates/users/usersTemp.html',
    'text!templates/users/userItemTemp.html',
    'text!templates/users/userFavConCardsTemp.html'

], function ($, _, Backbone,  Backendless, Models, DialogView, MainTemp, UstItemTemp, UsrFavConCardsTemp) {

    return Backbone.View.extend({
        el: '#wrapper',

        mainTemp    : _.template(MainTemp),
        userItemTemp: _.template(UstItemTemp),
        favCardsTemp: _.template(UsrFavConCardsTemp),

        initialize: function () {
            this.render();
        },

        events: {
            'click .usrRemoveBtn': 'letsRemoveUser',
            'click .usrEditBtn' : 'letsEditUser',
            'click .usrItem'    : 'letsShowUserCards'
        },

        letsRemoveUser: function (ev) {
            ev.stopPropagation();

            var self = this;
            var $userRow = this.$el.find(ev.target).closest('.usrItem');
            var userId = $userRow.attr('id');
            var userModel = this.collection.get(userId);

            if (confirm('Do you really want to remove user?')) {
                // hide such user row
                $userRow.hide();

                // remove user from db
                Backendless.Persistence.of(Models.User)
                    .remove(userModel, new Backendless.Async(
                        function success() {
                            // remove current user from user's collection
                            self.collection.remove(userId);
                            // remove user row
                            $userRow.remove();
                        },
                        function (err) {
                            // show user row
                            $userRow.show();
                            APP.errorHandler(err);
                        }
                    ));
            }
        },

        letsEditUser: function (ev) {
            ev.stopPropagation();

            var userId = this.$el.find(ev.target).closest('.usrItem').attr('id');
            var user   = this.collection.get(userId);

            this.dialogView = new DialogView({ model: user });
            this.dialogView.on('userAction', this.userAction, this)
        },

        letsShowUserCards: function (ev) {
            ev.stopPropagation();

            var userId = this.$el.find(ev.currentTarget).attr('id');
            this.renderFavCards(userId)
        },

        userAction: function (data) {
            var isNew    = data.isNew || false;
            var userData = data.model || { };

            if (isNew){
                this.collection.add(userData, { merge: true });
            }
        },
        
        renderUsers: function () {
            var usersData = this.collection.toJSON();
            var $userCont = this.$el.find('#userContainer').html('');

            var firstUserIdInList = usersData[0].objectId;

            // render every user's data
            usersData.forEach(function (user) {
                $userCont.append(this.userItemTemp(user));
            }.bind(this));

            this.renderFavCards(firstUserIdInList);
        },

        renderFavCards: function (userId) {
            var userFavCards  = this.collection.get(userId).get('favoritedContentCards');
            var $cardsContainer = this.$el.find('#favorContCardsContainer').html('');

            // render first user's favorites content cards
            $cardsContainer.append(this.favCardsTemp({ collection: userFavCards }));
        },
        
        render: function () {
            this.$el.html(this.mainTemp());
            this.renderUsers();
            
            return this;
        }
    });
});