'use strict';
var db = require('../../config/db/knex/knexConfig');
var bcrypt = require('bcrypt');
module.exports = (function () {
    function userModel() {
    }
    userModel.prototype.getUser = function () {
        return db.knex('feedz_users');
    };
    userModel.prototype.createUserIfNotExists = function (user) {
        console.log(user);
        return db.knex('users').where('username', user.username)
            .then(function (userResponse) {
            if (userResponse.length == 0) {
                return db.knex('users').insert({
                    username: user.username,
                    password: bcrypt.hashSync(user.password, 10),
                    email: user.email,
                    token: randToken.generate(16)
                });
            }
        });
    };
    userModel.prototype.checkUserLogin = function (user) {
        return db.knex('feedz_users').where(user);
    };
    userModel.prototype.checkUserToken = function (token) {
        return db.knex('feedz_users').where({ token: token });
    };
    return userModel;
}());
