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
        const clientId = getState().games.getIn([gameId, 'players', 0, 'id'])
        dispatch({
            type: ActionTypes.SOCKET_EMIT,
            clientId,
            name: SocketEventTypes.UPDATE_QUESTS,
            payload: {
                quests: getState().games.getIn([gameId, 'quests']).toJSON()
            }
        })
    }
}

const playersPerQuest = [
    [2, 3, 2, 3, 3],
    [2, 3, 4, 3, 4],
    [2, 3, 3, 4, 4],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5]
]