'use strict';

define(['underscore'],
    function (_) {
        var skypeRegExp = /^[\w\._@]{6,100}$/;
        var phoneRegExp = /^\+\d{2}\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
        var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var dateRegExp  = /^\d{2}\/\d{2}\/\d{4}$/;
        var nameRegExp  = /^[a-zA-Z]+[a-zA-Z-_\s]+$/;

        function isPassword (password) {
            return password || password.length ? '' : 'Password can not be empty. Please, try again';
        }

        function isUsername(username) {
            return username || username.match(nameRegExp) ? '' : 'Please, provide username';
        }

        function isEmail(email) {
           return email || email.match(emailRegExp) ? '' : 'Not email. Please, try again';
        }

        function isPhone(phone) {
            return phone || phone.match(phoneRegExp) ? '' : 'Wrong phone number. Please, try again'
        }

        function isBirthday(date) {
            return date || date.match(dateRegExp) ? '' : 'Not date. Please, try again';
        }

        function isImage(image) {
            if (!image) {
                return 'You did not attach any file. Please, select image';
            }

            if (image.size > 300000) {
                return 'too big file size (max size <= 300KB). Please, try again';
            }

            if (! (image.type in ['jpg','jpeg','gif','png','bmp'])) {
                return 'You uploaded not image. Please, try again';
            }
        }

        function isMatchedPasswords(pass, confPass) {
            return pass === confPass ? '' : 'Passwords not matched. Please, try again'
        }


        return {
            isMatchedPasswords: isMatchedPasswords,
            isBirthday        : isBirthday,
            isUsername        : isUsername,
            isPassword        : isPassword,
            isPhone           : isPhone,
            isEmail           : isEmail,
            isImage           : isImage
        }
    }
);