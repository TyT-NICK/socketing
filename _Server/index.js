const app   = require('express')()
const http  = require('http').Server(app)
const io    = require('socket.io')(http)

const PORT = 8080

const connectedClients = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

io.on('connection', (client) => {
  console.log('client connected')
  connectedClients.push(client) 

  client.on('message-sent', (msg) => {
    console.log(msg)
    if (msg) {
      connectedClients.map(client => client.emit('chat-message', msg))
    }
  })
})

http.listen(PORT, () => {
  console.log(`app at ${PORT}`)
})
