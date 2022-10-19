const users = new Map();
const Message = Models.Message;
const User = Models.User;

module.exports = {
    name: 'socket',
    version: '1.0.0',
    register: async (server, options) => {
        const io = require('socket.io')(server.listener);

        io.on('connection', (socket) => {
            socket.on('initialize', async (userId) => {
                let user = await User.findOne({ _id: userId });
                socket.user = user;
                user = users.get(socket.id);
                if (!user) {
                    users.set(socket.id, socket);
                }
                console.log(`${socket.user.name} is connected`);
            })

            socket.on('disconnect', () => {
                users.delete(socket.id)
                console.log(`${socket.user.name} is disconnected`);
            })

            socket.on('message', async (data) => {
                try {
                    //console.log('on message data received: ', data);
                    const { to, from, message } = JSON.parse(data);

                    const userFrom = await User.findOne({ _id: from });
                    const userTo = await User.findOne({ _id: to });

                    console.table({ from: userFrom.name, to: userTo.name, message: message });

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