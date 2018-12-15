"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var User = /** @class */ (function () {
    function User(username, email, password) {
        this.password = "";
        this.passwordHashed = false;
        this.username = username;
        this.email = email;
        if (!this.passwordHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    // Parse db result and return a User  
    User.fromDb = function (username, value) {
        console.log("3");
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new User(username, email, password);
    };
    //Hash et set password
    User.prototype.setPassword = function (plaintextpwd) {
        var saltRounds = 10;
        this.password = bcrypt.hash(plaintextpwd, saltRounds);
        this.passwordHashed = true;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    //Check si le mot de pass est correct
    User.prototype.validatePassword = function (inputPwd) {
        return bcrypt.compare(inputPwd, this.password);
    };
    return User;
}());
exports.User = User;
var UserHandler = /** @class */ (function () {
    function UserHandler(db) {
        this.db = db;
    }
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                throw err;
            if (data === undefined) {
                callback(null, data);
            }
            else
                callback(null, User.fromDb(username, data));
        });
    };
    UserHandler.prototype.save = function (user, callback) {
        this.db.put("user:" + user.username, user.getPassword() + ":" + user.email, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.delete = function (username, callback) {
        // TODO
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
