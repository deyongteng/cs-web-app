module.exports = function(io) {
    io.on('connection', function(socket) {

        // 访客上线
        socket.on('CLIENT_ON_LINE', function(data) {
            var data = data.userData;
            io.sockets.emit('SYSTEM_MESSAGE_CLIENT', {
                message: data.name + '已上线' // user login
            });
        })

        // 访客离线
        socket.on('CLIENT_OFF_LINE', function(data) {
            var data = data.userData;
            io.sockets.emit('SYSTEM_MESSAGE_CLIENT', {
                message: data.name + '已离线' // user login
            });
        })

        // 客服上线
        socket.on('SERVER_CLIENT_ON', function(data) {
            var data = data.userData;
            io.sockets.emit('SYSTEM_MESSAGE_SERVER', {
                message: data.name + '已上线' // user login
            });
        })

        // 信息中心
        socket.on('MESSAGE', function(data) {
            const type = data.type,
                userId = data.userID,
                toUserId = data.toUserId,
                message = data.message;

            if (!userId) new Error("请传入用户id");
            if (!toUserId) new Error("请传入客服id");

            // 发送到客服系统的 就 调用客服系统监听 访客方法
            if (type === 'SERVER_MESSAGE') {
                io.emit('CLIENT_MESSAGE', {
                    userId: userId,
                    toUserId: toUserId,
                    message: message
                })
            }
            // 发送到方可系统的 就 调用方可系统监听 客服方法
            else if (type === 'CLIENT_MESSAGE') {
                io.emit('SERVER_MESSAGE', {
                    userId: userId,
                    toUserId: toUserId,
                    message: message
                })
            }
        })

        socket.on('disconnect', function(data) {
            console.log(socket)
        });

    })
}