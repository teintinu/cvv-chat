
var expect = require('chai').expect
const WebSocket = require('ws');

describe("chatserver", function () {
    it('start/stop', async () => {
        const server = await startServer()
        expect(server.port).to.be.of('number')
        await server.stop()
        expect(server.port).to.be.of('undefined')
    })
    it.skip('1 usuario', () => {
        //    const maria = chatUser({ id: 'maria', name: 'Maria' })
    })
});

function chatUser(opts) {
    let presents = []
    var ws = new WebSocket('ws://localhost:' + port);
    ws.onerror = opts.onerror
    ws.onmessage = function (ms) { out.innerHTML += ms.data + '<br>'; }
    function send(msg) {
        ws.send(JSON.stringify({ msg: msg }));
    }
    function broadcast(msg, room) {
        ws.send(JSON.stringify({ room: room, msg: msg }))
    }
    function join(room) {
        ws.send(JSON.stringify({ join: room }));
    }
}