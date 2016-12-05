import * as ActionTypes from '../constants/ActionTypes'
import * as SocketEventTypes from '../constants/SocketEventTypes'

export const sendInfoForAllPlayers = (gameId) => {
    return (dispatch, getState) => {
        const players = getState().games.getIn([gameId, 'players']).toJSON()
        for(let i = 1; i < players.length; i++) {
            const info = getInfoForPlayer(i, players)
            dispatch(sendInfoForPlayer(players[i].id, info))
        }
    }
}

export const sendInfoForPlayer = (clientId, info) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.GIVE_PLAYER_INFO,
        payload: {...info}
    }
}

const getInfoForPlayer = (playerNum, players) => {
    return {
        role: players[playerNum].role
    }
}