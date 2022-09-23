'use strict';
const Boom = require('@hapi/boom');
const User = Models.User

module.exports = {
    create: async (request, h) => {
        try {
            const { name, mobile, age } = request.payload;
            let user = await User.findOne({ mobile: mobile });
            if (!user) {
                user = await new User({ name, mobile, age }).save();
            }

            return h.response({
                'success': 'user_created',
                'user': user
            }).code(201);
        } catch (e) {
            throw Boom.badRequest(e);
        }
    },
    remove: async (request, h) => {
        try {
            const id = request.params.id;
            const where = id ? {
                _id: id
            }: {};

            await User.remove(where).exec();
            return {
                'success': 'user_delete'
            };
        } catch (e) {
            return Boom.badData(e);
        }
    },
    find: async (request, h) => {
        try {
            const id = request.params.id;
            const where = id ? {
                _id: id
            } : {};

            const query = await User.find(where).exec();
            return query;
        } catch (e) {
            return Boom.badData(e);
        }
    },
    update: async (request, h) => {
        try {
            const { name, age, ik, sk, opk } = request.payload;
            const result = await User.findOneAndUpdate({
                _id: request.params.id
            }, { name, age, ik, sk, opk }, {
                new: true
            }).exec();
            return result;
        } catch (e) {
            return Boom.badRequest(e);
        }
    }
}