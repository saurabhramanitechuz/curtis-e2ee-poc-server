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
        from: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        },
        message: {
            type: String
        },        
    },
    statics: {},
    methods: {},
    onSchema: {
        pre: {},
        post: {}
    }
}