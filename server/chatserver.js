var express = require('express')
var ExpressPeerServer = require('peer').ExpressPeerServer

let app, server
let port = process.env.PORT || 3000

startExpressApp();
startPeerServer();
// setTimeout(() => console.log('fim'), 20000)

function startExpressApp() {
    console.log('chatserver')
    app = express();
    app.get('/hw', function (req, res) {
        res.send('Hello World!');
    });
    app.use(express.static(__dirname + '/../public'))
    server = app.listen(port, () => {
        console.log('public ' + __dirname + '/../public')
        console.log('listening on port', port)
    });
}

function startPeerServer() {
    console.log('peerServer /peerjs/chatserver')
    const peerServer = ExpressPeerServer(server, {
        path: '/chatserver'
    });
    app.use('/peerjs', peerServer);
}

function stopAll() {
    if (server) server.close()
    server = null
    app = null
    port = null
}
