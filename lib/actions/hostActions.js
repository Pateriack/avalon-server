import * as ActionTypes from '../constants/ActionTypes'
import * as SocketEventTypes from '../constants/SocketEventTypes'
import {startSetup, setRoles, pickInitialPartyLeader, sendUpdatePlayers, startPartySelection} from './gameActions'
import {setupQuests, sendQuestsUpdate} from './questActions'
import {sendInfoForAllPlayers} from './playerActions'

export const startSetupRequest = (clientId) => {
    return (dispatch, getState) => {
        const state = getState()
        const client = state.clients.get(clientId).toJSON()
        const gameId = client.game
        if(!gameId || !client.host)
            dispatch(startSetupFailure(clientId, 'You are not the host of a game!'))
        else
            dispatch(startSetup(gameId))
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

export const submitRulesRequest = (clientId, rules) => {
    return (dispatch, getState) => {
        let {roles} = rules
        roles = shuffleRoles(roles)
        const state = getState()
        const gameId = state.clients.getIn([clientId, 'game'])
        const numPlayers = state.games.getIn([gameId, 'players']).size - 1
        if(roles.length !== numPlayers){
            dispatch(submitRulesFailure(clientId, 'Number of roles does not match number of players! WTF!'))
            return
        }
        dispatch(setRoles(gameId, roles))
        dispatch(setupQuests(gameId, numPlayers))
        dispatch(sendQuestsUpdate(gameId))
        dispatch(sendInfoForAllPlayers(gameId))
        dispatch(pickInitialPartyLeader(gameId))
        dispatch(sendUpdatePlayers(gameId))
        dispatch(startPartySelection(gameId))
    }
}

export const submitRulesFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.SUBMIT_RULES_FAILURE,
        payload: {
            error
        }
    }
}

const shuffleRoles = roles => {
    let i, j, temp
    for(i = roles.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        temp = roles[i]
        roles[i] = roles[j]
        roles[j] = temp
    }
    return roles
}
