
import Peer from 'peerjs'

type PeerId = "PeerId"

const args = location.hash.slice(1).split(';')
const localId: PeerId = args[0] as PeerId

interface Conexao {
    conn: Peer.DataConnection,
    conectado?: 1 | false | true,
    online?: 1 | false | true
}

const conexoes: { [key in PeerId]: Conexao } = {} as any

var peer = new Peer({
    key: localId,
    secure: true,
    host: location.hostname,
    port: parseInt(location.port, 10),
    path: '/chatserver',
});

args.slice(1).forEach((a) => {
    iniciaConexao(a)
})

peer.on('connection', function (conn) {
    eventosConexao(conn)
});

function iniciaConexao(remoteId: PeerId) {
    let r = conexoes[remoteId]
    if (!r) {
        r = (conexoes[remoteId] = { conectado: 1, conn: peer.connect(remoteId) })
        r.conn.on('open', () => {
            ping(remoteId)
        });
        r.conn.on('close', () => {
            delete conexoes[remoteId]
        });
        r.conn.on('data', (data) => {
            if (typeof data === 'string') {
                const p = data.split('\v')

            }
        });
    }
    return r
}

function ping(remoteId: PeerId) {
    sendTo(remoteId, localId, Object.keys(conexoes))
}

function sendTo(comando: string, remoteId: PeerId, args: any[]) {
    const r = conexoes[remoteId]
    if (r.conn) {
        args.unshift(comando, remoteId)
        r.conn.send(args.join('\v'))
    }
}