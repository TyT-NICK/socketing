const clients = () => {
  const clientList = {}

  //TODO: split connection and disconnection handler

  const updateClientList = () => {
    for (const [name, client] of Object.entries(clientList)) {
      const connectedClientsNames = Object.keys(clientList)

      client.emit('clientlist-update', connectedClientsNames)
    }
  }

  const connectionHandler = (newClient) => {
    const newClientName = newClient.handshake.query.name

    if (clientList[newClientName] !== undefined) {
      newClient.emit('disconnection', { reason: 'the name\'s already been taken' })
      return newClient.disconnect()
    }

    clientList[newClientName] = newClient
    console.log(newClientName, 'connected')
    updateClientList()
  }

  const disconnectionHandler = (client) => {
    const clientName = client.handshake.query.name

    delete clientList[clientName]
    console.log(clientName, 'disconnected')
    updateClientList()
  }

  const publicMessageHandler = (client, msg) => {
    const clientName = client.handshake.query.name
    const namedMsg = `${clientName}: ${msg}`

    console.log(namedMsg)

    for (const [name, client] of Object.entries(clientList)) {
      client.emit('public-message', { clientName, msg })
    }
  }

  
  return { clientList, connectionHandler, disconnectionHandler, publicMessageHandler }
}

module.exports = clients
