const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const WebSocket = require('ws');
const MessageController = require("../controllers/message.controller");

module.exports = [
    {
        method: 'GET',
        path: '/message/{id}',
        handler: MessageController.getAll,
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.objectId().required()
                }),
                options: {
                    abortEarly: false,
                    allowUnknown: true
                }
            },
            auth: false
        },
    },
    {
        method: 'POST',
        path: '/messages',
        handler: MessageController.create,
        options: {
            validate: {
                payload: Joi.object({
                    userId: Joi.objectId().required(),
                    message: Joi.string().min(2).max(1000).required()
                }),
                options: {
                    abortEarly: false,
                    allowUnknown: false
                }
            },
            auth: false
        }
    },
    /*  provide full-featured exclusive WebSocket route  */
    // {
    //     method: "POST",
    //     path: "/message",
    //     options: {
    //         response: { emptyStatusCode: 204 },
    //         payload: { output: "data", parse: true, allow: "application/json" },
    //         auth: false,
    //         plugins: {
    //             websocket: {
    //                 event: 'message',
    //                 only: true,
    //                 initially: true,
    //                 connect: ({ ctx, ws }) => {
    //                     if (ws.readyState === WebSocket.OPEN)
    //                         ws.send(JSON.stringify({ cmd: "PING" }))
    //                 },
    //                 disconnect: ({ ws }) => {
    //                     console.log('disconnected');
    //                 }
    //             }
    //         }
    //     },
    //     handler: (request, h) => {
    //         const { initially, ws } = request.websocket()
    //         if (initially) {
    //             ws.send(JSON.stringify({ cmd: "HELLO" }))
    //             return ""
    //         } else {
    //             console.log('request.websocket()', request.websocket());
    //             request.websocket().peers[0]._socket.emit('message', request.payload)
    //             // ws.emit('message', request.payload)
    //             // const peers = request.websocket().peers
    //             // peers.forEach((peer) => {
    //             //     // console.log('peers: ', peers);
    //             //     peer.send(JSON.stringify({ payload: request.payload }))
    //             // })
    //             return ""
    //         }
    //         return Boom.badRequest("unknown command")
    //     }
    // }
]