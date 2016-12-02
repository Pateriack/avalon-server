import SocketIO from 'socket.io'
import http from 'http'

import config from '../config'
import {createAvalonStore} from './store'
import SocketHandler from './socket/SocketHandler'

const app = http.createServer()
const io = SocketIO(app)
const store = createAvalonStore()
new SocketHandler(io, store)

app.listen(config.port)

console.log(`Listening on port: ${config.port}`)

