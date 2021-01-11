const app   = require('express')()
const http  = require('http').Server(app)
const io    = require('socket.io')(http)

const clientController = require('./controllers/client.controller')()

const PORT = 8080

const connectedClients = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (client) => {

  clientController.connectionHandler(client)

  client.on('disconnect', () => clientController.disconnectionHandler(client))
  client.on('message-sent', (msg) => clientController.publicMessageHandler(client, msg))
})

http.listen(PORT, () => {
  console.log(`app at ${PORT}`)
})
