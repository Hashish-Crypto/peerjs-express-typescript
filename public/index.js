const peer = new Peer({ host: 'localhost', port: 8000, path: '/peerjs/myapp', debug: 1 })
let peerID
let receiverPeerID
let receiverConnection
let senderConnection
let isConnectionCreator = false

peer.on('open', (id) => {
  console.log('My peer ID is: ' + id)
  peerID = id
  const peerIdNode = document.getElementById('peerIdNode')
  peerIdNode.innerText = peerID
})

const connectButton = document.getElementById('connectButton')
connectButton.onclick = () => {
  receiverPeerID = document.getElementById('receiverPeerIdNode').value

  receiverConnection = peer.connect(receiverPeerID)

  receiverConnection.on('open', () => {
    console.log('Receiver connection open.')
    // Receive messages
    receiverConnection.on('data', (data) => {
      console.log('Receiver sent:', data)
    })

    // Send messages
    receiverConnection.send('Hello from ' + peerID)

    isConnectionCreator = true
  })
}

peer.on('connection', (connection) => {
  senderConnection = connection

  senderConnection.on('open', () => {
    console.log('Sender connection open.')
    // Receive messages
    senderConnection.on('data', (data) => {
      console.log('Sender sent:', data)
    })

    // Send messages
    senderConnection.send('Hello from ' + peerID)
  })
})

const sendMessageButton = document.getElementById('sendMessageButton')
sendMessageButton.onclick = () => {
  const message = document.getElementById('messageInput').value
  console.log('Sended: ' + message)
  if (isConnectionCreator) {
    receiverConnection.send(message)
  } else {
    senderConnection.send(message)
  }
}

// const receivedMessages = document.getElementById('receivedMessages')
