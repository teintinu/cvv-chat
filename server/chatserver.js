var express = require('express')
var ExpressPeerServer = require('peer').ExpressPeerServer

module.exports.startServer = startServer

if (process.argv[2] === 'start') startServer()

async function startServer() {
    let app, server
    const port = process.env.PORT || 3010

    await startExpressApp();
    await startPeerServer();
    await startChatServer();
    return {
        port,
        stop: stopAll()
    }

    function startExpressApp() {
        return new Promise((resolve, reject) => {
            try {
                app = express();
                app.use(express.static('public'))
                server = app.listen(port);
                server.on("listening", () => {
                    console.log('chatserver on port', port)
                    resolve()
                })
            }
            catch (e) {
                reject(e)
            }
        })
    }

    async function startPeerServer() {
        const peerServer = ExpressPeerServer(server, {
            path: '/chatserver'
        });
        app.use('/peerjs', peerServer);
    }

    async function stopAll() {
        if (server) server.close()
        server = null
        app = null
        port = null
    }

    function presence(room) {
        const l = wss.clients.filter(client => client.h5 && client.h5.rooms[room])
        const s = JSON.stringify({
            presence: room,
            presents: l.map((client) => ({ id: client.h5.id, name: client.h5.name, level: client.h5.rooms[room] }))
        })
        l.forEach((client) => client.send(s))
    }

    function broadcast(room, sender, messageStr) {
        wss.clients.forEach(client => {
            if (client.h5 && client.h5.id !== sender && client.h5.rooms[room])
                client.send(messageStr)
        })
    }

}

function stopServer() {

}