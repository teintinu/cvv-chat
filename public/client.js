
const args = location.hash.slice(1).split(';')
const key = args[0]
const tipo = args[1]
const remote = args[1]

var conexoes = []

var peer = new Peer({
    host: location.hostname,
    port: location.port,
    path: '/chatserver',
    key,
    secure: true
});


if (tipo === 'S') {
    var sConn = peer.connect(args[2]);
    conexao(conn)
}

peer.on('connection', function (conn) {
    conexao(conn)
});

function conexao(conn) {
    conn.on('data', (data) => {
        // Will print 'hi!'
        console.log(data);
    });
    conn.on('open', () => {
        ping()
    });
}