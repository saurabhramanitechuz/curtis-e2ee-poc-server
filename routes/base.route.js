'use strict';
const Joi = require('joi');
const Boom = require('@hapi/boom');
const Path = require('path');

module.exports = [{
    method: '*',
    path: '/{p*}',
    handler: (request, h) => {
        return Boom.badRequest('route does not exist');
    },
    options: {
        auth: false,
        validate: {
            options: {
                abortEarly: false,
                allowUnknown: true
            }
        }
    }
},{
    method: 'GET',
    path: '/home',
    handler: (request, h) => {
        const location = Path.join(__dirname, '../public/index.html')
        console.log(location);
        return h.file(location)
    },
    options: {
        auth: false,
        validate: {
            options: {
                abortEarly: false,
                allowUnknown: true
            }
        }
    }
}]