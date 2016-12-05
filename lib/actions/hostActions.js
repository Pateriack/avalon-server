import * as ActionTypes from '../constants/ActionTypes'
import * as SocketEventTypes from '../constants/SocketEventTypes'

export const startSetup = (clientId) => {
    return (dispatch, getState) => {
        const state = getState()
        const client = state.clients.get(clientId).toJSON()
        const gameId = client.game
        if(!gameId || !client.host)
            dispatch(startSetupFailure(clientId, 'You are not the host of a game!'))
        else
            dispatch(startSetupSuccess(gameId))
    }
}

export const startSetupFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.START_SETUP_FAILURE,
        payload: {
            error
        }
    }
}

export const startSetupSuccess = (gameId) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.START_SETUP,
            gameId
        })
        const clientIds = getState().games.getIn([gameId, 'players']).toJSON().map(player => player.id)
        dispatch({
            type: ActionTypes.SOCKET_EMIT,
            clientIds,
            name: SocketEventTypes.START_SETUP_SUCCESS
        })
    }
}