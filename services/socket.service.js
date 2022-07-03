var gIo = null

function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*',
        }
    })
    gIo.on('connection', socket => {
        console.log(`New connected socket [id: ${socket.id}]`)
        socket.on('disconnect', socket => {
            console.log(`Socket disconnected [id: ${socket.id}]`)
        })

    })
}

function broadcastVote(color) {
    console.log(color);
    gIo.emit('vote added', color)
}

module.exports = {
    setupSocketAPI,
    broadcastVote
}
