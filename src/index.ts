import express from 'express'
import dotenv from 'dotenv'
import { ExpressPeerServer } from 'peer'
import path from 'path'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.static('public'))

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

const listener = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

const peerServer = ExpressPeerServer(listener, {
  path: '/myapp',
})

app.use('/peerjs', peerServer)
