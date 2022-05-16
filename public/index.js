const peer = new Peer({ host: 'localhost', port: 8000, path: '/peerjs/myapp', debug: 1 })
let peerID
let receiverPeerID
let receiverConnection
let senderConnection
let isSendingConnection = false
const videoNode = document.getElementById('videoNode')

const renderMessage = (message) => {
  const messageTag = document.createElement('p')
  const messageText = document.createTextNode(message)
  messageTag.appendChild(messageText)
  const receivedMessagesNode = document.getElementById('receivedMessagesNode')
  receivedMessagesNode.appendChild(messageTag)
}

const renderVideo = (stream) => {
  videoNode.srcObject = stream
}

peer.on('open', (id) => {
  peerID = id
  console.log('My peer ID is: ' + peerID)
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

    senderConnection.on('data', (data) => {
      renderMessage('Sender sent: ' + data)
      console.log('Sender sent: ' + data)
    })

    senderConnection.send('Hello from ' + peerID)
  })
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

    receiverConnection.on('data', (data) => {
      renderMessage('Receiver sent: ' + data)
      console.log('Receiver sent:', data)
    })

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

    isSendingConnection = true
  })
}

const sendMessageButton = document.getElementById('sendMessageButton')
sendMessageButton.onclick = () => {
  const message = document.getElementById('messageInput').value
  if (isSendingConnection) {
    renderMessage('Sender sent: ' + message)
    console.log('Sender sent: ' + message)
    receiverConnection.send(message)
  } else {
    renderMessage('Receiver sent: ' + message)
    console.log('Receiver sent: ' + message)
    senderConnection.send(message)
  }
}
