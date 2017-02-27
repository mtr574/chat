var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

// Firebase
// var admin = require("firebase-admin");
// 
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: "https://chatwithnate-1334f.firebaseio.com"
// });

var users = [],
    connections = [];

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.set('port', (process.env.PORT || 5000));

server.listen(app.get('port'));

app.get('/connections', (req, res) => {
    res.send({
        connections: connections.length
    })
})

io.sockets.on('connection', (socket) => {
    // create connection
    connections.push(socket)

    // disconnect
    socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1)
    })

    // send message
    socket.on('send message', (msgData) => {
        io.sockets.emit('new message', {
            msg: msgData
        })
    })
})