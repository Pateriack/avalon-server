import * as ActionTypes from '../constants/ActionTypes'
import * as QuestStatus from '../constants/QuestStatus'
import * as SocketEventTypes from '../constants/SocketEventTypes'

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

export const setPartyMemberRequest = (clientId, memberId) => {
    return (dispatch, getState) => {
        if(!checkIfLeader(getState(), clientId)) {
            dispatch(setPartyMemberFailure(clientId, 'You are not the party leader!'))
            return
        }
        const gameId = getState().clients.getIn([clientId, 'game'])
        if(!checkIfPartyFull(getState(), gameId)){
            dispatch(setPartyMemberFailure(clientId, 'Party is full!'))
            return
        }
    }
}

export const setPartyMember = (gameId, memberId) => {
    return {
        type: ActionTypes.SET_PARTY_MEMBER,
        gameId,
        memberId
    }
}

export const setPartyMemberFailure = (clientId, error) => {
    return {
        type: ActionTypes.SOCKET_EMIT,
        clientId,
        name: SocketEventTypes.SET_PARTY_MEMBER_FAILURE,
        payload: {
            error
        }
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

const checkIfLeader = (state, clientId) => {
    const gameId = state.clients.getIn([clientId, 'game'])
    if(!gameId)
        return false
    const players = state.games.getIn([gameId, 'players'])
    if(!players)
        return false
    const player = players.find(player => player.get('id') === clientId)
    if(!player)
        return false
    return player.get('leader')
}

const checkIfPartyFull = (state, gameId) => {
    return false //TODO actually check if party is full
}

const playersPerQuest = [
    [2, 3, 2, 3, 3],
    [2, 3, 4, 3, 4],
    [2, 3, 3, 4, 4],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5]
]