import * as ActionTypes from '../constants/ActionTypes'

import {removeGame} from './gameActions'

export const clientConnected = clientId => {
    return {
        type: ActionTypes.CLIENT_CONNECTED,
        clientId
    }
}

export const clientDisconnected = clientId => {
    return (dispatch, getState) => {
        let gameId = getState().clients.getIn([clientId, 'game'])
        dispatch({
            type: ActionTypes.CLIENT_DISCONNECTED,
            clientId,
            gameId
        })
        //TODO determine if the game should actually be removed.. probably only remove on disconnect if client is host and game is in lobby, or if game is over
        // if(gameId) dispatch(removeGame(gameId))
    }
}