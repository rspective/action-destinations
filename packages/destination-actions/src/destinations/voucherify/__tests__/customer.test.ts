import nock from 'nock'
import { createTestEvent, createTestIntegration } from '@segment/actions-core'
import Voucherify from '../index'
import { Settings } from '../generated-types'
import { AccountRegion } from '../utils'
import { trackApiEndpoint } from '../utils'

const testDestination = createTestIntegration(Voucherify)

const settings: Settings = {
  apiKey: 'voucherifyApiKey',
  secretKey: 'voucherifySecretKey',
  apiEndpoint: AccountRegion.EU
}

describe('Voucherify', () => {
  describe('identifyCustomer', () => {
    it('should throw error when source_id is not specified', async () => {
      nock(`${trackApiEndpoint(settings.apiEndpoint)}/segmentio`)
        .post('/customer-processing')
        .reply(200)
      const testEvent = createTestEvent({
        traits: {
          name: 'Test'
        },
        type: 'identify'
      })

      await expect(
        testDestination.testAction('identifyCustomer', {
          event: testEvent,
          settings
        })
      ).rejects.toThrowError("The root value is missing the required field 'source_id'.")
    })
  })

  describe('groupEvent', () => {
    it('should throw error when group_id is not specified', async () => {
      nock(`${trackApiEndpoint(settings.apiEndpoint)}/segmentio`)
        .post('/group-processing')
        .reply(200)
      const testEvent = createTestEvent({
        traits: {
          name: 'Test'
        },
        type: 'group',
        properties: {
          source_id: 'test_customer_1'
        }
      })

      await expect(
        testDestination.testAction('groupEvent', {
          event: testEvent,
          settings
        })
      ).rejects.toThrowError("The root value is missing the required field 'group_id'.")
    })
  })
})