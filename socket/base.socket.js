const users = new Map();
const Message = Models.Message;

module.exports = {
    name: 'socket',
    version: '1.0.0',
    register: async (server, options) => {
        const io = require('socket.io')(server.listener);

        io.on('connection', (socket) => {
            socket.on('initialize', (userId) => {
                socket.userId = userId;
                const user = users.get(socket.id);
                if (!user) {
                    users.set(socket.id, socket);
                }
                console.log(`socket user ${socket.userId} is connected`);
            })

            socket.on('disconnect', () => {
                users.delete(socket.id)
                console.log(`socket user ${socket.userId} is disconnected`);
            })

            socket.on('message', async (data) => {
                try {
                    console.log('on message data received: ', data);
                    const { to, from, message } = JSON.parse(data);

                    for (const [k, v] of users) {
                        // console.log("v.userId: ", v.userId);
                        if (v.userId === to) {
                            socket.broadcast.emit('message', message);
                            return;
                        }
                    }
                    await new Message({ from, to, message }).save();
                } catch (error) {
                    console.error(error);
                }
            });
        })

    }
}