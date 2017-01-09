export const generateGameId = () => {
    let text = "";
    const charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i < 6; i++)
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
}

export const gameCantBeJoined = (state, gameId) => {
    let game = state.games.get(gameId)
    if(!game)
        return 'Game does not exist!'
    if(game.get('gameState') != GameState.WAITING_FOR_PLAYERS)
        return 'Game is already started!'
    if(game.get('players').length > 10)
        return 'Game is full!'
}

export const getClientIdsForGame = (state, gameId) => {
    return state.games.getIn([gameId, 'players']).toJSON().map(player => player.id)
}

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export const getTeamForRole = role => {
    switch(role) {
        case Roles.ROLE_GOOD:
        case Roles.ROLE_MERLIN:
        case Roles.ROLE_PERCIVAL:
            return Teams.GOOD_TEAM

        case Roles.ROLE_EVIL:
        case Roles.ROLE_ASSASSIN:
        case Roles.ROLE_MORGANA:
        case Roles.ROLE_OBERON:
            return Teams.EVIL_TEAM

        default:
            return Teams.NO_TEAM
    }
}

export const checkIfLeader = (state, clientId) => {
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

export const checkIfPartyFull = (state, gameId) => {
    let game = state.games.get(gameId)
    let numPlayers = game.get('players').size
    let partySize = game.get('players').count(p => p.get('party'))
    let questNumber = game.get('quests').findLastIndex(q => q.get('status') === QuestStatus.QUEST_IN_PROGRESS)
    return partySize >= playersPerQuest[numPlayers - 5][questNumber]
}

export const playersPerQuest = [
    [2, 3, 2, 3, 3],
    [2, 3, 4, 3, 4],
    [2, 3, 3, 4, 4],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5],
    [3, 4, 4, 5, 5]
]