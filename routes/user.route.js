'use strict';
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Boom = require('@hapi/boom');
const UserController = require('../controllers/user.controller')

const failAction = async (request, h, err) => {
    if (process.env.NODE_ENV === 'production') {
        // In prod, log a limited error message and throw the default Bad Request error.
        console.error('ValidationError:', err.message); // Better to use an actual logger here.
        throw Boom.badRequest(`Invalid request payload input`);
    } else {
        // During development, log and respond with the full error.
        console.error(err);
        throw err;
    }
}

module.exports = [{
    method: 'GET',
    path: '/user/{id?}',
    handler: UserController.find,
    options: {
        description: 'Get users',
        notes: 'Returns a user when id is passed otherwise return all user list',
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.objectId()
            }),
            options: {
                abortEarly: false,
                allowUnknown: true
            }
        },
        auth: false
    }
},
{
    method: 'POST',
    path: '/user',
    handler: UserController.create,
    options: {
        description: 'Create user',
        notes: 'Create and returns a user with id and other details',
        tags: ['api'],
        validate: {
            payload: Joi.object({
                name: Joi.string().min(3).max(50).required(),
                mobile: Joi.string()
                    .length(10)
                    .pattern(/^\d+$/)
                    .required()
                    .messages({
                        'string.base': `"mobile" should be valid 10 character contact number`,
                        'string.pattern.base': `"mobile" should be valid 10 character only digits`,
                        'string.required': `"mobile" must be provided`,
                        'string.length': `"mobile" must be 10 digits`
                    }),
                age: Joi.number()
            }).label('User'),
            failAction: failAction,
            options: {
                abortEarly: false,
                allowUnknown: true
            }
        },
        auth: false
    }
},
{
    method: 'DELETE',
    path: '/user/{id?}',
    handler: UserController.remove,
    options: {
        validate: {
            params: Joi.object({
                id: Joi.objectId()
            }),
            options: {
                abortEarly: false,
                allowUnknown: true
            }
        },
        auth: false
    }
},
{
    method: 'PUT',
    path: '/user/{id}',
    handler: UserController.update,
    options: {
        tags: ['api'],
        validate: {
            params: Joi.object({
                id: Joi.required()
            }),
            payload: Joi.object({
                name: Joi.string().min(3).max(50),
                age: Joi.number().min(18).max(100),
                ik: Joi.object({
                    type: Joi.number().required(),
                    key: Joi.string().required()
                }),
                sk: Joi.object({
                    id: Joi.number().required(),
                    key: Joi.string().required(),
                    signature: Joi.string().required()
                }),
                opk: Joi.array().items(
                    Joi.object({
                        id: Joi.number().required(),
                        key: Joi.string().required()
                    })
                ).min(1).max(100)
            }).label('user_update'),
            options: {
                abortEarly: false,
                allowUnknown: true
            }
        },
        auth: false
    }
}
]