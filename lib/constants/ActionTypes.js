//Emit socket action (not handled by any reducers, socket.io middleware will emit to sockets)
export const SOCKET_EMIT = 'SOCKET_EMIT'

//Client actions
export const CLIENT_CONNECTED = 'CLIENT_CONNECTED'
export const CLIENT_DISCONNECTED = 'CLIENT_DISCONNECTED'

//Game actions
export const CREATE_GAME = 'CREATE_GAME'
export const REMOVE_GAME = 'REMOVE_GAME'
export const SET_ROLES = 'SET_ROLES'

//Player actions
export const SET_HOST = 'SET_HOST'
export const ADD_PLAYER = 'ADD_PLAYER'
export const SET_NAME = 'SET_NAME'

//Gamestate actions
export const START_SETUP = 'START_SETUP'
export const START_PARTY_SELECTION = 'START_PARTY_SELECTION'

//quest actions
export const SETUP_QUESTS = 'SETUP_QUESTS'

//party actions
export const SET_LEADER = 'SET_LEADER'
export const SET_PARTY_MEMBER = 'SET_PARTY_MEMBER'
export const REMOVE_PARTY_MEMBER = 'REMOVE_PARTY_MEMBER'
export const CLEAR_PARTY = 'CLEAR_PARTY'