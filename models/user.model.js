'use strict';
const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const Schema = Mongoose.Schema
const ObjectId = Schema.ObjectId
const HashPassword = require("../services/hashPassword.service")

module.exports = {
    schema: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now()
        },
        name: {
            type: String
        },
        mobile: {
            type: String
        },
        age: {
            type: Number
        },
        ik: {
            type: {
                type: Number
            },
            key: {
                type: String
            }
        },
        sk: {
            id: {
                type: Number
            },
            key: {
                type: String
            },
            signature: {
                type: String
            }
        },
        opk: [{
            id: {
                type: Number
            },
            key: {
                type: String
            }
        }]
    },
    statics: {},
    methods: {
        comparePassword: function (candidatePassword, cb) {
            Bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
                if (err) {
                    return cb(err);
                }
                cb(null, isMatch);
            });
        }
    },
    onSchema: {
        pre: {
            save: [
                HashPassword
            ],
            findOneAndUpdate: [
                HashPassword,
                function () {
                    this.update({}, {
                        $set: {
                            updatedAt: new Date()
                        }
                    });
                }
            ]
        },
        post: {}
    }
}