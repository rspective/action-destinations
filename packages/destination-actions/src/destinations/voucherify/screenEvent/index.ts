import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import { setVoucherifyRequestURL } from '../utils'
import type { Payload } from './generated-types'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Screen Event',
  description: 'Send the page event.',
  fields: {
    source_id: {
      label: 'Voucherify Customer ID',
      description:
        'The ID necessary to [create or update customer](https://docs.voucherify.io/reference/the-customer-object) and [create custom event](https://docs.voucherify.io/reference/create-custom-event) in Voucherify.',
      type: 'string',
      required: true,
      default: {
        '@if': {
          exists: { '@path': '$.userId' },
          then: { '@path': '$.userId' },
          else: { '@path': '$.anonymousId' }
        }
      }
    },

    name: {
      label: 'Event Name',
      description: 'The name of the [custom event](https://docs.voucherify.io/reference/the-custom-event-object).',
      type: 'string',
      required: true,
      default: {
        '@if': {
          exists: { '@path': '$.name' },
          then: { '@path': '$.name' },
          else: { '@path': '$.event' }
        }
      }
    },
    metadata: {
      label: 'Screen Event Metadata',
      description: 'Optional data to include with the event.',
      type: 'object',
      default: {
        '@path': '$.properties'
      }
    },
    type: {
      label: 'Event Type',
      description: 'Type of event',
      type: 'string',
      required: true,
      default: {
        '@path': '$.type'
      }
    }
  },

  perform: (request, { settings, payload }) => {
    const voucherifyRequestURL = setVoucherifyRequestURL(settings, 'event')
    return request(voucherifyRequestURL, {
      method: 'post',
      json: payload
    })
  }
}

export default action
