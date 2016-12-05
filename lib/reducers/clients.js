import {Map} from 'immutable'

import * as ActionTypes from '../constants/ActionTypes'

const INITIAL_STATE = Map({})

const clientsReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.CLIENT_CONNECTED:
            return state.set(action.clientId, Map({}))

        case ActionTypes.CLIENT_DISCONNECTED:
            return state.delete(action.clientId)

        case ActionTypes.SET_HOST:
            return state.set(action.clientId, Map({
                game: action.gameId,
                host: true
            }))

        case ActionTypes.ADD_PLAYER:
            return state.set(action.clientId, Map({
                game: action.gameId,
                player: true
            }))

        default:
            return state
    }
}

export default clientsReducer