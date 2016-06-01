/**
 * Created by andrey on 27.05.2016.
 */

"use strict";

define([
    'jQuery',
    'Underscore',
    'Backbone',
    'Backendless',
    'models',
    'text!templates/home/homeTemp.html',
    'text!templates/home/userItemTemp.html',
    'text!templates/home/userEditTemp.html',
    'text!templates/home/animalEditTemp.html'

], function ($, _, Backbone, Backendless, Models, MainTemp, UserItemTemp, UserEditTemp, AnimEditTemp) {
    var HomeView;
    HomeView = Backbone.View.extend({
        el: '#wrapper',
        
        collection: null,
        model     : null,
        
        template    : _.template(MainTemp),
        userTemp    : _.template(UserItemTemp),
        editTemp    : _.template(UserEditTemp),
        animEditTemp: _.template(AnimEditTemp),

        initialize: function () {
            this.activeUserId = (this.collection && this.collection.length) ? this.collection.at(0).id : null;
            
            this.render();
        },
        
        events: {
            'click .usrItem'       : 'onUsrClick',
            'click #editBtn'       : 'onEditClick',
            'change #editFileImage': 'prepareForDrawing'
        },
        
        prepareForDrawing: function (event) {
            event.preventDefault();
            
            var self = this;
            var $inputFile = self.$el.find('#editFileImage');
            var file = $inputFile[0].files[0];
            var filesExt = ['jpg', 'png', 'jpeg', 'bmp', 'JPEG', 'JPG', 'PNG', 'BMP'];
            var parts = $inputFile.val().split('.');
            var fr;
            
            if (filesExt.join().search(parts[parts.length - 1]) !== -1) {
                fr = new FileReader();
                
                fr.onload = function () {
                    var src = fr.result;
                    
                    self.$el.find('#editImage').attr('src', src);
                };
                
                if (file) {
                    fr.readAsDataURL(file);
                }
                
            } else {
                alert('Invalid file type!');
            }
        },
        
        onUsrClick: function (ev) {
            var usrId = $(ev.currentTarget).attr('id');
            
            this.renderUserEdit(usrId)
        },
        
        onEditClick: function () {
            var self = this;
            var userData = this.model.toJSON();
            var UserModel = Models.user;
            var usrName = this.$el.find('#usrEditBox').find('#editName').val().trim();
            var usrEmail = this.$el.find('#usrEditBox').find('#editEmail').val().trim();
            var $fileImage = this.$el.find('#usrEditBox').find('#editFileImage');
            var fileImage;

            if ($fileImage[0].files && $fileImage[0].files[0]) {
                fileImage = $fileImage[0].files[0];
            }
            
            userData.name = usrName;
            userData.email = usrEmail;

            this.letsUploadFile(fileImage, function (err, saveFile) {
                if (err) {
                    APP.errorHandler(err);
                }

                if (saveFile && saveFile.fileURL) {
                    userData.avatar = saveFile.fileURL;
                }

                Backendless.Persistence.of(UserModel).save(userData, new Backendless.Async(
                    function (usr) {
                        self.collection.add(usr, {merge: true});
                        self.renderUsers()
                    },
                    APP.errorHandler
                ));
            });

        },
        
        renderUserEdit: function (usrId) {
            var userData;
            
            this.model = this.collection.get(usrId);
            userData = this.model.toJSON();
            
            this.$el.find('#usrEditBox').html(this.editTemp(userData));
        },
        
        renderUsers: function () {
            var usersData = this.collection.toJSON();
            var $container = this.$el.find('#usrContainer').html('');
            
            usersData.forEach(function (usr) {
                $container.append(this.userTemp(usr));
            }.bind(this))
        },
        
        render: function () {
            
            this.$el.html(this.template());
            this.renderUsers();
            if (this.activeUserId) {
                this.renderUserEdit(this.activeUserId);
                this.animEditTemp({
                    avatar: '',
                    name  : '',
                    type  : ''
                });
            }
            
            return this;
        }
        
    });
    
    return HomeView;
    
});