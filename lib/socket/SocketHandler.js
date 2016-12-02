import {clientConnected, clientDisconnected} from '../actions/clientActions'

export default class SocketHandler {
    constructor(io, store) {
        this.io = io
        this.store = store

        this.onConnect = this.onConnect.bind(this)
        this.onDisconnect = this.onDisconnect.bind(this)

        this.io.on('connection', this.onConnect)
    }

    onConnect(socket) {
        this.store.dispatch(clientConnected(socket.id))
        socket.on('disconnect', () => this.onDisconnect(socket.id))
    }

    onDisconnect(id) {
        this.store.dispatch(clientDisconnected(id))
    }
}