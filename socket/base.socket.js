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
                const dbUser = await User.findOne({ _id: userId }, {ik: 0, sk: 0, opk: 0});
                if(!dbUser) {
                    return;
                }
                socket.user = dbUser;
                const user = users.get(socket.id);
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

                    console.log({ from: userFrom.name, to: userTo.name, message: message });

                    for (const [k, v] of users) {
                        if (v.user && v.user.id === to) {
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