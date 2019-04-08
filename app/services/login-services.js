var async = require('async');
var config = require("config");
var DataPower = config.get('DataPower');
var request = require('request');
var User = require('../models/user');
var config = require('config');
var crypto = require('crypto');
var _emailCredentials = config.get("EmailCredentials");

var mailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var smtpTransportt = mailer.createTransport(smtpTransport({
    host: _emailCredentials.host,
    secureConnection: false,
    port: _emailCredentials.port,
    headers: 'Content-Type/multipart',
    auth: {
        user: _emailCredentials.userName,
        pass: _emailCredentials.password
    }
}));

exports.getLogin = function getLogin(args, res, next) {
    var header = args || '';
    var token = header.split(/\s+/).pop() || '';
    var auth = new Buffer(token, 'base64').toString();
    var parts = auth.split(/:/);
    var username = parts[0];
    var password = parts[1];


    User.findOne({
        username: {
            $regex: username,
            $options: 'i'
        },
        active: true
    }, (err, user) => {

        if (err) {
            throw err;
        }
        if (!user) {
            var response = {
                message: 'User not found'
            };
            res.writeHead(403, {
                "Content-Type": "application/json"
            });
            return res.end(JSON.stringify(response));
        } else if (user) {
            if (user.password !== password) {
                var response = {
                    message: 'Wrong Password'
                };
                res.writeHead(403, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify(response));
            } else {
                var response = {
                    token: user
                };
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify(response));
            }
        }
    });
}

exports.postLogin = function postLogin(args, res, next) {
    var options;
    var token;
    var user;

    options = {
        method: 'POST',
        url: DataPower.baseUrl,
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        form: {
            client_id: DataPower.client_id,
            client_secret: DataPower.client_secret,
            grant_type: 'password',
            scope: 'scope1',
            username: args.username,
            password: args.password
        }
    };

    // Verify user and get token
    token = new Promise((resolve, reject) => {
        request(options, getToken)

        function getToken(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;
            if (error || response.headers['content-type'] == 'text/html') {
                _res.statusCode = 401;
                _res.data = JSON.parse(error) || 'Unauthorized user';
                reject(_res);
            } else {
                _res.data = JSON.parse(body);
                resolve(_res);
            }
        }
    });

    // Get user object base on username
    user = userObj => new Promise((resolve, reject) => {
        var options = usersOption(userObj);

        request(options, getUser)

        function getUser(error, response, body) {
            var _res = {};
            _res.statusCode = response.statusCode;

            if (error) {
                _res.data = JSON.parse(error);
                reject(_res);
            } else {
                _res.data = JSON.parse(body);
                resolve(_res);
            }
        }
    });

    // Call Token API
    token.then(onfulfilled, onrejected);

    function onfulfilled(token) {
        var userObj = {
            username: args.username,
            password: args.password,
            authorization: token.data.token_type + ' ' + token.data.access_token
        };

        // Call User API
        user(userObj).then(userSuccess, onrejected);

        function userSuccess(user) {
            var _response = {};
            if (user.statusCode === 200) {
                _response.token = token.data;
                _response.user = user.data;
                return res.status(user.statusCode).json(_response);
            } else {
                _response = {
                    status: false,
                    message: 'User not found!'
                };
                return res.status(user.statusCode).json(_response);
            }
        }
    }

    // Error handel
    function onrejected(error) {
        return res.status(401).json(error);
    }
}

// Return user option with query string

function usersOption(userObj) {

    var queryRegex = new RegExp("^" + userObj.username + "$", "i");

    var _qs = {
        'filter[where][username][regexp]': queryRegex,
        'filter[where][password]': userObj.password,
        'filter[where][active]': true
    };

    var options = {
        method: 'GET',
        url: DataPower.url + DataPower.Models.users + getParams(_qs),
        headers: setOption(userObj.authorization)
    };
    return options;
}

exports.postSignup = function postSignup(args, res, next) {
    var email = args.email;
    var password = args.password;
    var firstName = args.firstName;
    var lastName = args.lastName;
    var username = args.username;

    User.findOne({
        'username': username,
        'active': true
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            var response = {
                success: false,
                message: 'This user is already registered'
            };
            res.writeHead(403, {
                'Content-Type': 'application/json'
            });
            return res.end(JSON.stringify(response));
        } else {
            User.findOne({
                'email': email
            }, function (err, checkEmail) {
                if (checkEmail) {
                    var response = {
                        success: false,
                        message: 'Please change email, we already have this one.'
                    };
                    res.writeHead(403, {
                        "Content-Type": "application/json"
                    });
                    return res.end(JSON.stringify(response));
                } else {

                    var token = crypto.randomBytes(20).toString('hex');
                    var newUser = new User();
                    newUser.email = email;
                    newUser.password = password;
                    newUser.firstName = firstName;
                    newUser.lastName = lastName;
                    newUser.username = username;
                    newUser.role = 0;
                    newUser.createdAt = new Date();
                    newUser.active = false;
                    newUser.resetPasswordToken = token;

                    newUser.save(function (err, success) {
                        if (err) {
                            throw err;
                        }
                        if (success) {
                            var mail = {
                                from: _emailCredentials.from, // Sender email id.
                                to: success.email, // Receiver email id.
                                subject: 'Here is the link for email verification',
                                html: 'Hello ' + success.firstName + ',<br/><br/>' +
                                    'Click on this link, and we will get you on your way.<br/><br/>' +
                                    'To login in your Trucadence, click <a href="https://trucadence.lexiconnetworks.com/#/verifyUser/' + success.resetPasswordToken +
                                    '">here</a> or paste the following link into your browser:<br/><br/>' +
                                    '<a href="https://trucadence.lexiconnetworks.com/#/verifyUser/' + success.resetPasswordToken + '">https://trucadence.lexiconnetworks.com/#/' +
                                    'verifyUser/' + success.resetPasswordToken + '</a><br/><br/>' +
                                    'If you did not request this, please ignore this email.<br/><br/><br/>' +
                                    'Thank you for using Trucadence!<br/>' +
                                    'The Trucadence Team.',
                            };

                            smtpTransportt.sendMail(mail, function (error, response) {
                                if (error) {
                                    console.log('Error Message:', error);
                                } else {
                                    console.log('Password Reset Link Sent to ' + success.email);
                                }
                                smtpTransportt.close();
                            });
                            var response = {
                                success: true,
                                message: 'Registration completed, please check your email for login'
                            };
                            res.writeHead(200, {
                                "Content-Type": "application/json"
                            });
                            return res.end(JSON.stringify(response));
                        }
                    });
                }
            });
        }
    });
}

exports.verifyUsers = function verifyUsers(token, res, next) {
    User.findOne({
        'resetPasswordToken': token
    }, function (err, user) {
        if (!user) {
            var response = {
                success: false,
                message: 'Token is invalid or please register again'
            };
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            return res.end(JSON.stringify(response));
        } else {
            user.resetPasswordToken = undefined;
            user.active = true;
            user.save(function (err) {
                var response = {
                    success: true,
                    message: 'User verified successfully'
                };
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify(response));
            });
        }
    });
}

exports.forgotPassword = function forgotPassword(email, res, next) {
    async.waterfall([
            generateRandomToken,
            lookupUserAndUpdateToken,
            sendAndVerifyToken
        ],
        function (err) {
            if (err) {
                return next(err);
            }
        });

    function generateRandomToken(done) {
        crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString('hex');
            done(err, token);
        });
    }

    function lookupUserAndUpdateToken(token, done) {
        User.findOne({
            'email': email
        }, function (err, user) {
            if (!user) {
                var response = {
                    success: false,
                    message: 'No account with that email address exists.'
                };
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify(response));
            } else {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function (err) {
                    done(err, token, user);
                });
            }
        });
    }

    function sendAndVerifyToken(token, user, done) {
        var mail = {
            from: _emailCredentials.from, // Sender email id.
            to: user.email, // Receiver email id.
            subject: 'Here is the link to reset your password',
            html: 'Hello ' + user.firstName + ',<br/><br/>' +
                'Reset your password, and we will get you on your way.<br/><br/>' +
                'To change your Trucadence password, click <a href="https://trucadence.lexiconnetworks.com/#/resetPwd/' + token +
                '">here</a> or paste the following link into your browser:<br/><br/>' +
                '<a href="https://trucadence.lexiconnetworks.com/#/resetPwd/' + token + '">https://trucadence.lexiconnetworks.com' +
                '/#/resetPwd/' + token + '</a><br/><br/>' +
                'If you did not request this, please ignore this email and your password will remain unchanged.<br/><br/>' +
                'This link will expire in 1 hours, so be sure to use it right away.<br/><br/><br/>' +
                'Thank you for using Trucadence!<br/>' +
                'The Trucadence Team.',

        };
        smtpTransportt.sendMail(mail, function (error, response) {
            if (error) {
                callback(null, error);
            } else {
                var response = {
                    success: true,
                    message: 'Password Reset Link Sent to ' + user.email
                };
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify(response));
            }
            smtpTransportt.close();
        });
    }

}

exports.resetPasswordToken = function resetPasswordToken(token, res, next) {
    User.findOne({
        'resetPasswordToken': token,
        'resetPasswordExpires': {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user) {
            var response = {
                success: false,
                message: 'Password reset token is invalid or has expired!'
            };
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            return res.end(JSON.stringify(response));
        } else {
            var response = {
                success: true,
                resetPasswordToken: user.resetPasswordToken,
            };
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            return res.end(JSON.stringify(response));
        }
    });
}

exports.changePassword = function changePassword(token, password, res, next) {
    async.waterfall([
            changePassword,
            sendConfirmation
        ],
        function (err) {
            if (err) {
                return next(err);
            }
        });

    function changePassword(done) {
        User.findOne({
            'resetPasswordToken': token,
            'resetPasswordExpires': {
                $gt: Date.now()
            }
        }, function (err, user) {
            if (!user) {
                var response = {
                    success: false,
                    message: 'Password reset token is invalid or has expired.'
                };
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify(response));
            } else {
                user.password = password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function (err) {
                    done(err, user);
                });
            }
        });
    }

    function sendConfirmation(user, done) {
        var mail = {
            from: _emailCredentials.from, // Sender email id.
            to: user.email, // Receiver email id.
            subject: 'Your password has been changed',
            html: 'Hello ' + user.firstName + ',<br/><br/>' +
                'This is a confirmation that the password for your account ' + user
                .email + ' has just been changed.<br/><br/><br/>' +
                'Thank you for using Trucadence!<br/>' +
                'The Trucadence Team. '
        };
        smtpTransportt.sendMail(mail, function (error, response) {
            if (error) {
                callback(null, error);
            } else {
                var response = {
                    success: true,
                    message: 'Password changed successfully.'
                };
                res.writeHead(200, {
                    "Content-Type": "application/json"
                });
                return res.end(JSON.stringify(response));
            }
            smtpTransportt.close();
        });
    }
}



/** Implemented reset password functionality */
exports.resetPassword = function resetPassword(req, res, next) {

    var newUser = {};
    newUser = {
        id: req.id,
        active: req.active,
        role: req.role,
        username: req.username,
        lastName: req.lastName,
        firstName: req.firstName,
        password: req.password,
        email: req.email
    }
    var options = {
        new: true
    };

    User.findByIdAndUpdate({
        _id: newUser.id
    }, newUser, options, function (err, result) {
        if (err) {
            console.log(err.stack);
            return next(err.message);
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    });
};