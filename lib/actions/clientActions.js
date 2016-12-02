import * as ActionTypes from '../constants/ActionTypes'

export const clientConnected = id => {
    console.log(`connected: ${id}`)
    return {
        type: ActionTypes.CLIENT_CONNECTED,
        payload: {
            id
        }
    }
}

export const clientDisconnected = id => {
    console.log(`disconnected: ${id}`)
    return {
        type: ActionTypes.CLIENT_DISCONNECTED,
        payload: {
            id
        }
    }
}