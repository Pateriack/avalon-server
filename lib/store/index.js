import {createStore} from 'redux'
import devToolsEnhancer from 'remote-redux-devtools'

import rootReducer from '../reducers'

export const createAvalonStore = () => createStore(rootReducer, devToolsEnhancer({realtime: true}))