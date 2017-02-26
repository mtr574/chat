var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)
redis = require('redis');
var users = [],
    connections = [];

// Redis client
var port = '6379',
host = process.env.REDIS_URL;
if (process.env.NODE_ENV === 'production') {
  port = '28829',
  host = process.env.REDIS_URL
}
var client = redis.createClient(port, host);
// Error handler
client.on('error', function(err) {
    console.log("Error " + err);
});

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
