import {SOCKET_EMIT} from '../constants/ActionTypes'

const socketIO = io => () => next => action => {
    if (action.type === SOCKET_EMIT) {
        let ids = Array.isArray(action.clientIds) ? action.clientIds : [action.clientId]
        for(var id of ids)
            io.to(id).emit(action.name, action.payload)
    }
    return next(action);
};

export default socketIO;