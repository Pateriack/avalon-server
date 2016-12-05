import {expect} from 'chai'

import {clientConnected, clientDisconnected} from '../../lib/actions/clientActions'
import * as ActionTypes from '../../lib/constants/ActionTypes'

describe('Client actions', () => {

    const clientId = 'ABC123'

    it('creates a connected action', () => {
        const action = {
            type: ActionTypes.CLIENT_CONNECTED,
            clientId
        }
        expect(clientConnected(clientId)).to.deep.equal(action)
    })

    it('creates a disconnected action', () => {
        const action = {
            type: ActionTypes.CLIENT_DISCONNECTED,
            clientId
        }
        expect(clientDisconnected(clientId)).to.deep.equal(action)
    })

})