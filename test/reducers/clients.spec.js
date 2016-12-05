import {expect} from 'chai'
import {Map} from 'immutable'

import clients from '../../lib/reducers/clients'
import * as ActionTypes from '../../lib/constants/ActionTypes'

describe('clients reducer', () => {

    const clientId = 'ABC123'

    it('returns initial state', () => {
        expect(
            clients(undefined, {})
        ).to.equal(Map({}))
    })

    it(`should handle ${ActionTypes.CLIENT_CONNECTED}`, () => {
        expect(
            clients(
                Map({}),
                {
                    type: ActionTypes.CLIENT_CONNECTED,
                    clientId
                }
            )
        ).to.equal(
            Map({
                [clientId]: Map({})
            })
        )
    })

    it(`should handle ${ActionTypes.CLIENT_DISCONNECTED}`, () => {
        expect(
            clients(
                Map({
                    [clientId]: Map({})
                }),
                {
                    type: ActionTypes.CLIENT_DISCONNECTED,
                    clientId
                }
            )

        ).to.equal(Map({}))
    })

})