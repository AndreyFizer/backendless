/**
 *
 * Created by Anton on 02.06.16.
 */
"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/users/userEditTemp.html',

], function ($, _, Backbone, Backendless, Models, MainTemp) {
    var ItemView
    ItemView = Backbone.View.extend({

        template: _.template(MainTemp),

        initialize: function () {
            this.addMode = !this.model;
            this.render();
        },

        events: {
            'click #cancelBtn': 'letsCloseDialog',
            'click #saveBtn'  : 'letsSaveUser'
        },

        letsSaveUser: function (ev) {
            ev.stopPropagation();

            var $dialogCont = this.$el.find('userData');

            var name    = $dialogCont.find('#name').val();
            var email   = $dialogCont.find('#email').val();
            var surname = $dialogCont.find('#surname').val();
            
        },

        letsCloseDialog: function () {
            this.remove();
        },

        render: function () {
            var self = this;

            var retailerData = this.addMode ? {} : this.model.toJSON();

            this.undelegateEvents();

            var dialogOptions = {
                closeOnEscape: true,
                autoOpen     : true,
                draggable    : true,
                resizable    : false,
                height       : 400,
                width        : 320,
                title        : 'User page',
                modal: true,
                buttons: [
                    {
                        text: 'Save',
                        click: function() {
                            var name  = $dialogForm.find('#name').val();
                            var email = $dialogForm.find('#email').val();
                            var surname = $dialogForm.find('#surname').val();

                            if (name === user.name && email === user.email) {
                                self.dialog('close');
                                self.remove();
                            }

                            user.name     = name;
                            user.email    = email;
                            user.lastName = surname;

                            Backendless.UserService.update(user)
                                .then(function () {
                                    $dialogForm.remove();
                                    self.render();
                                })
                                .catch(function (err) {
                                    APP.handleError(err);
                                });
                        }
                    },
                    {
                        text: 'Close',
                        click: function () {
                            self.dialog('close');
                        }
                    }
                ],
                close: function () {
                    self.remove();
                }
            };

            this.undelegateEvents();

            this.$el.html(this.template(retailerData)).dialog(dialogOptions);

            this.delegateEvents();


            return this;
        }

    });

    return ItemView;
});
