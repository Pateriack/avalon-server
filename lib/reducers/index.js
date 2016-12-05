import {combineReducers} from 'redux'

import clients from './clients'
import games from './games'

export default combineReducers({
    clients,
    games
})
