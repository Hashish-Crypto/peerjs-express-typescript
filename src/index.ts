import express from 'express'
import dotenv from 'dotenv'
import { ExpressPeerServer } from 'peer'

dotenv.config()

const app = express()
const port = process.env.PORT

app.get('/', (req, res, next) => {
  res.send('Express + TypeScript Server')
})

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

const peerServer = ExpressPeerServer(server, {
  path: '/myapp',
})

app.use('/peerjs', peerServer)
