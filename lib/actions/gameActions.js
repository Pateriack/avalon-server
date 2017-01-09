import * as ActionTypes from '../constants/ActionTypes'
import * as SocketEventTypes from '../constants/SocketEventTypes'
import * as GameState from '../constants/GameState'
import * as Roles from '../constants/Roles'
import * as Teams from '../constants/Teams'
import {generateGameId, gameCantBeJoined, getClientIdsForGame, getRandomInt, getTeamForRole} from '../utils'

export const hostGame = clientId => {
    return (dispatch, getState) => {
        let idFound = false
        while(!idFound) {
            let gameId = generateGameId()
            if(!getState().games.has(gameId)){
                idFound = true
                dispatch({
                    type: ActionTypes.CREATE_GAME,
                    gameId
                })
                dispatch(setHost(clientId, gameId))
                dispatch(hostGameSuccess(clientId, gameId))
            }
        }
    }
}

export const setHost = (clientId, gameId) => {
    return {
        type: ActionTypes.SET_HOST,
        clientId,
        gameId
    }
}

export const hostGameSuccess = (clientId, gameId) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.HOST_GAME_SUCCESS,
        payload: {
            gameId
        }
    }
}

export const joinGame = (clientId, gameId) => {
    return (dispatch, getState) => {
        let error = gameCantBeJoined(getState(), gameId)
        if(error) {
            dispatch(joinGameFailure(clientId, error))
        }else{
            const playerNumber = getState().games.getIn([gameId, 'players']).size
            const name = `Player ${playerNumber}`
            dispatch(addPlayer(clientId, gameId, name))
            dispatch(joinGameSuccess(clientId, gameId, playerNumber, name))
            dispatch(sendUpdatePlayers(gameId))
        }
    }
}

export const addPlayer = (clientId, gameId, name) => {
    return {
        type: ActionTypes.ADD_PLAYER,
        clientId,
        gameId,
        name
    }
}

export const joinGameFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.JOIN_GAME_FAILURE,
        payload: {
            error
        }
    }
}

export const joinGameSuccess = (clientId, gameId, playerNumber, name) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.JOIN_GAME_SUCCESS,
        payload: {
            clientId,
            gameId,
            playerNumber,
            name
        }
    }
}

export const removeGame = (gameId) => {
    return {
        type: ActionTypes.REMOVE_GAME,
        gameId
    }
}

export const sendUpdatePlayers = (gameId) => {
    return (dispatch, getState) => {
        const players = getState().games
            .getIn([gameId, 'players'])
            .toJSON()
            .map(player => {
                return {
                    id: player.id,
                    name: player.name,
                    connected: player.connected,
                    player: player.player,
                    host: player.host,
                    leader: player.leader,
                    party: player.party
                }
            })
        const clientIds = players
            .filter(player => player.connected)
            .map(player => player.id)
        dispatch({
            type: ActionTypes.SOCKET_EMIT,
            clientIds,
            name: SocketEventTypes.UPDATE_PLAYERS,
            payload: {
                players
            }
        })
    }
}

export const setPlayerNameRequest = (clientId, name) => {
    return (dispatch, getState) => {
        const gameId = getState().clients.getIn([clientId, 'game'])
        if(!gameId) {
            dispatch(setPlayerNameFailure(clientId, 'You are not currently in a game!'))
            return
        }
        const gameState = getState().games.getIn([gameId, 'gameState'])
        if(!gameState === GameState.WAITING_FOR_PLAYERS && !gameState === GameState.SETTING_UP_RULES){
            dispatch(setPlayerNameFailure(clientId, 'You can\'t set your name after the game has begun!'))
            return
        }
        if(name.length === 0){
            dispatch(setPlayerNameFailure(clientId, 'Your name can\'t be blank!'))
            return
        }
        const nameTaken = getState()
            .games.getIn([gameId, 'players'])
            .filter(player => player.get('id') !== clientId)
            .reduce((taken, player) => taken || player.get('name') === name, false)
        if(nameTaken){
            dispatch(setPlayerNameFailure(clientId, 'Name already taken!'))
            return
        }
        dispatch(setPlayerName(clientId, gameId, name))
        dispatch(setPlayerNameSuccess(clientId, name))
        dispatch(sendUpdatePlayers(gameId))
    }
}

export const setPlayerName = (clientId, gameId, name) => {
    return {
        type: ActionTypes.SET_NAME,
        clientId,
        gameId,
        name
    }
}

export const setPlayerNameFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.SET_NAME_FAILURE,
        payload: {
            error
        }
    }
}

export const setPlayerNameSuccess = (clientId, name) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.SET_NAME_SUCCESS,
        payload: {
            name
        }
    }
}

export const startSetup = (gameId) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.START_SETUP,
            gameId
        })
        const clientIds = getClientIdsForGame(getState(), gameId)
        dispatch({
            type: ActionTypes.SOCKET_EMIT,
            clientIds,
            name: SocketEventTypes.START_SETUP_SUCCESS
        })
    }
}

export const setRoles = (gameId, roles) => {
    let teams = roles.map(getTeamForRole)
    return {
        type: ActionTypes.SET_ROLES,
        gameId,
        roles,
        teams
    }
}

export const pickInitialPartyLeader = gameId => {
    return (dispatch, getState) => {
        const numPlayers = getState().games.getIn([gameId, 'players']).size - 1
        const leaderIndex = getRandomInt(1, numPlayers)
        dispatch({
            type: ActionTypes.SET_LEADER,
            gameId,
            leaderIndex
        })
    }
}

export const startPartySelection = (gameId) => {
    return (dispatch, getState) => {
        const clientIds = getClientIdsForGame(getState(), gameId)
        dispatch({
            type: ActionTypes.START_PARTY_SELECTION,
            gameId
        })
        dispatch({
            type: ActionTypes.SOCKET_EMIT,
            clientIds,
            name: SocketEventTypes.START_PARTY_SELECTION
        })
    }
}