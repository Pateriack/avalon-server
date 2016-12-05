import {clientConnected, clientDisconnected} from '../actions/clientActions'
import {hostGame, joinGame, setPlayerNameRequest} from '../actions/gameActions'
import {startSetupRequest, submitRulesRequest} from '../actions/hostActions'
import * as SocketEventTypes from '../constants/SocketEventTypes'

export default class SocketHandler {
    constructor(io, store) {
        this.io = io
        this.store = store

        this.onConnect = this.onConnect.bind(this)

        this.io.on('connection', this.onConnect)
    }

    onConnect(socket) {
        this.store.dispatch(clientConnected(socket.id))
        socket.on('disconnect', () => this.store.dispatch(clientDisconnected(socket.id)))
        socket.on(SocketEventTypes.HOST_GAME_REQUEST, () => this.store.dispatch(hostGame(socket.id)))
        socket.on(SocketEventTypes.JOIN_GAME_REQUEST, payload => this.store.dispatch(joinGame(socket.id, payload.gameId)))
        socket.on(SocketEventTypes.START_SETUP_REQUEST, () => this.store.dispatch(startSetupRequest(socket.id)))
        socket.on(SocketEventTypes.SET_NAME_REQUEST, payload => this.store.dispatch(setPlayerNameRequest(socket.id, payload.name)))
        socket.on(SocketEventTypes.SUBMIT_RULES_REQUEST, payload => this.store.dispatch(submitRulesRequest(socket.id, payload)))
    }
}