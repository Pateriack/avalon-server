import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import socketMiddleware from '../socket/socketMiddleware'
import {composeWithDevTools} from 'remote-redux-devtools'

import rootReducer from '../reducers'

const composeEnhancers = composeWithDevTools({realtime: true})

export const createAvalonStore = (io) => createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk, socketMiddleware(io))
))