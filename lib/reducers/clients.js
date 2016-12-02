import {Map} from 'immutable'

import * as ActionTypes from '../constants/ActionTypes'

const INITIAL_STATE = Map({})

const clientsReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.CLIENT_CONNECTED:
            return state.set(action.payload.id, Map({}))
        case ActionTypes.CLIENT_DISCONNECTED:
            return state.delete(action.payload.id)
        default:
            return state
    }
}

export default clientsReducer