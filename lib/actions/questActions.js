import * as ActionTypes from '../constants/ActionTypes'
import * as QuestStatus from '../constants/QuestStatus'
import * as SocketEventTypes from '../constants/SocketEventTypes'
import {sendUpdatePlayers} from './gameActions'
import {checkIfLeader, checkIfPartyFull, playersPerQuest, getClientIdsForGame} from '../utils'

export const setupQuests = (gameId, numPlayers) => {
    let quests = []
    for(let i = 0; i < 5; i++) {
        quests.push({
            number: i + 1,
            status: i === 0 ? QuestStatus.QUEST_IN_PROGRESS : QuestStatus.QUEST_NOT_STARTED,
            players: playersPerQuest[numPlayers][i]
        })
    }
    return {
        type: ActionTypes.SETUP_QUESTS,
        quests,
        gameId
    }
}

export const sendQuestsUpdate = gameId => {
    return (dispatch, getState) => {
        const players = getState().games.getIn([gameId, 'players']).toJSON()
        const clientIds = players
            .filter(player => player.connected)
            .map(player => player.id)
        dispatch({
            type: ActionTypes.SOCKET_EMIT,
            clientIds,
            name: SocketEventTypes.UPDATE_QUESTS,
            payload: {
                quests: getState().games.getIn([gameId, 'quests']).toJSON()
            }
        })
    }
}

export const selectPartyMemberRequest = (clientId, memberId) => {
    return (dispatch, getState) => {
        if(!checkIfLeader(getState(), clientId)) {
            dispatch(selectPartyMemberFailure(clientId, 'You are not the party leader!'))
            return
        }
        const gameId = getState().clients.getIn([clientId, 'game'])
        if(checkIfPartyFull(getState(), gameId)){
            dispatch(selectPartyMemberFailure(clientId, 'Party is full!'))
            return
        }
        dispatch(selectPartyMember(gameId, memberId))
        dispatch(sendUpdatePlayers(gameId))
    }
}

export const selectPartyMember = (gameId, memberId) => {
    return {
        type: ActionTypes.SET_PARTY_MEMBER,
        gameId,
        memberId
    }
}

export const selectPartyMemberFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.SELECT_PARTY_MEMBER_FAILURE,
        payload: {
            error
        }
    }
}

export const removePartyMemberRequest = (clientId, memberId) => {
    return (dispatch, getState) => {
        if(!checkIfLeader(getState(), clientId)) {
            dispatch(selectPartyMemberFailure(clientId, 'You are not the party leader!'))
            return
        }
        const gameId = getState().clients.getIn([clientId, 'game'])
        dispatch(removePartyMember(gameId, memberId))
        dispatch(sendUpdatePlayers(gameId))
    }
}

export const removePartyMember = (gameId, memberId) => {
    return {
        type: ActionTypes.REMOVE_PARTY_MEMBER,
        gameId,
        memberId
    }
}

export const removePartyMemberFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.REMOVE_PARTY_MEMBER_FAILURE,
        payload: {
            error
        }
    }
}

export const confirmPartyRequest = (clientId) => {
    return (dispatch, getState) => {
        if(!checkIfLeader(getState(), clientId)) {
            dispatch(confirmPartyFailure(clientId, 'You are not the party leader!'))
            return
        }
        const gameId = getState().clients.getIn([clientId, 'game'])
        dispatch(startPartyVote(gameId))
    }
}

export const confirmPartyFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.CONFIRM_PARTY_FAILURE,
        payload: {
            error
        }
    }
}

export const startPartyVote = (gameId) => {
    return (dispatch, getState) => {
        dispatch({
            type: ActionTypes.START_PARTY_VOTING,
            payload: {
                gameId
            }
        })
        dispatch(sendUpdatePlayers(gameId))
        const clientIds = getClientIdsForGame(getState(), gameId)
        dispatch({
            type: ActionTypes.SOCKET_EMIT,
            name: SocketEventTypes.START_PARTY_VOTING,
            clientIds
        })
    }
}

