const peer = new Peer({ host: 'localhost', port: 8000, path: '/peerjs/myapp', debug: 1 })
let peerID
let receiverPeerID
let receiverConnection
let senderConnection
let isConnectionCreator = false
const videoNode = document.getElementById('videoNode')

const renderVideo = (stream) => {
  videoNode.srcObject = stream
}

const renderMessage = (message) => {
  const tag = document.createElement('p')
  const text = document.createTextNode(message)
  tag.appendChild(text)
  const element = document.getElementById('receivedMessages')
  element.appendChild(tag)
}

peer.on('open', (id) => {
  console.log('My peer ID is: ' + id)
  peerID = id
  const peerIdNode = document.getElementById('peerIdNode')
  peerIdNode.innerText = peerID
})

peer.on('error', (error) => {
  console.error(error)
})

peer.on('connection', (connection) => {
  senderConnection = connection

  senderConnection.on('open', () => {
    console.log('Sender connection open.')
  })

  // Receive messages
  senderConnection.on('data', (data) => {
    renderMessage(data)
    console.log('Sender sent: ' + data)
  })

  // Send messages
  senderConnection.send('Hello from ' + peerID)
})

peer.on('call', (call) => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      call.answer(stream)
      call.on('stream', renderVideo)
    })
    .catch((err) => {
      console.error('Failed to get local stream.', err)
    })
})

const connectButton = document.getElementById('connectButton')
connectButton.onclick = () => {
  receiverPeerID = document.getElementById('receiverPeerIdNode').value

  receiverConnection = peer.connect(receiverPeerID)

  receiverConnection.on('open', () => {
    console.log('Receiver connection open.')
  })

  // Receive messages
  receiverConnection.on('data', (data) => {
    renderMessage('Receiver sent: ' + data)
    console.log('Receiver sent:', data)
  })

  // Send messages
  receiverConnection.send('Hello from ' + peerID)

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      const call = peer.call(receiverPeerID, stream)
      call.on('stream', renderVideo)
    })
    .catch((err) => {
      console.log('Failed to get local stream', err)
    })

  isConnectionCreator = true
}

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
