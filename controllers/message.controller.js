'use strict';

const Boom = require("@hapi/boom");
const Message = Models.Message;

module.exports = {
    getAll: async (request, h) => {
        try {
            const id = request.params.id;
            const messages = await Message.find({ to: id });
            console.log(messages);
            
            await Message.remove({
                to: id
            }).exec();
            
            return messages;
        } catch (err) {
            return Boom.badData(err)
        }
    },
    create: async (request, h) => {
        try {
            return await new Message(request.payload).save();
        } catch (err) {
            return Boom.badData(err)
        }
    }
}

