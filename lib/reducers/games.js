import {Map, List, fromJS} from 'immutable'

import * as ActionTypes from '../constants/ActionTypes'
import * as GameState from '../constants/GameState'

const INITIAL_STATE = Map({})

const gamesReducer = (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case ActionTypes.CREATE_GAME:
            return state.set(action.gameId,
                Map({
                    players: List(),
                    gameState: GameState.WAITING_FOR_PLAYERS
                })
            )

        case ActionTypes.SET_HOST:
            return state.setIn([action.gameId, 'players', 0], Map({
                id: action.clientId,
                connected: true,
                host: true
            }))

        case ActionTypes.REMOVE_GAME:
            return state.delete(action.gameId)

        case ActionTypes.ADD_PLAYER:
            return state.updateIn([action.gameId, 'players'], players => players.push(Map({
                id: action.clientId,
                connected: true,
                name: action.name,
                player: true
            })))

        case ActionTypes.START_SETUP:
            return state.setIn([action.gameId, 'gameState'], GameState.SETTING_UP_RULES)

        case ActionTypes.SET_NAME:
            const playerNumber = state.getIn([action.gameId, 'players']).findIndex(player => player.get('id') === action.clientId)
            return state.setIn([action.gameId, 'players', playerNumber, 'name'], action.name)

        case ActionTypes.SET_ROLES:
            return state.updateIn([action.gameId, 'players'], players => players.map((player, index) => index === 0 ? player : player.merge({role: action.roles[index - 1], team: action.teams[index - 1]})))

        case ActionTypes.SETUP_QUESTS:
            return state.setIn([action.gameId, 'quests'], fromJS(action.quests))

        case ActionTypes.SET_LEADER:
            return state.updateIn([action.gameId, 'players'], players =>
                players.map((player, index) =>
                    index === action.leaderIndex ? player.set('leader', true) : player.set('leader', false)))

        case ActionTypes.START_PARTY_SELECTION:
            return state.setIn([action.gameId, 'gameState'], GameState.CHOOSING_PARTY)

        case ActionTypes.SET_PARTY_MEMBER:
            return state.updateIn([action.gameId, 'players'],
                players => players.map(player =>
                    player.get('id') === action.memberId ? player.set('party', true) : player))

        case ActionTypes.REMOVE_PARTY_MEMBER:
            return state.updateIn([action.gameId, 'players'],
                players => players.map(player =>
                    player.get('id') === action.memberId ? player.set('party', false) : player))

        case ActionTypes.CLEAR_PARTY:
            return state.updateIn([action.gameId, 'players'],
                players => players.map(player => player.set('party', false)))

        case ActionTypes.START_PARTY_VOTING:
            return state.updateIn([action.gameId, 'gameState'], GameState.VOTING_ON_PARTY)

        default:
            return state
    }
}

export default gamesReducer