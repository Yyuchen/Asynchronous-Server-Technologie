"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new User(username, email, password);
    };
    //Hash et set password
    User.prototype.setPassword = function (toSet) {
        this.password = toSet;
        this.passwordHashed = true;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    // return comparison with hashed password
    User.prototype.validatePassword = function (toValidate) {
        return this.password === toValidate;
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
                throw callback(err);
            else if (data === undefined)
                callback(null, data);
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
