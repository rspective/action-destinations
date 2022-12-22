import { ActionDefinition } from '@segment/actions-core'
import { Settings } from '../generated-types'
import { trackApiEndpoint } from '../utils'
import { Payload } from './generated-types'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Identify Customer',
  description: 'Track an event for known or anonymous person',
  defaultSubscription: 'type = "identify"',
  fields: {
    source_id: {
      label: 'Customer ID',
      description:
        'The ID necessary to [create or update customer](https://docs.voucherify.io/reference/the-customer-object) and [create custom event](https://docs.voucherify.io/reference/create-custom-event) in Voucherify.',
      type: 'string',
      required: true,
      default: {
        '@path': '$.userId'
      }
    },
    created_at: {
      label: 'Created At',
      description: 'A timestamp of when the person was created.',
      type: 'string',
      default: {
        '@template': '{{traits.created_at}}'
      }
    },
    traits: {
      label: 'Person Attributes',
      description:
        'Optional attributes for the person. When updating a person, attributes are added or updated, not removed.',
      type: 'object',
      default: {
        '@path': '$.traits'
      }
    },
    email: {
      label: 'Email Address',
      description: "The person's email address.",
      type: 'string',
      default: {
        '@template': '{{traits.email}}'
      }
    },
    type: {
      label: 'Event Type',
      description: 'Type of event',
      type: 'string',
      default: {
        '@path': '$.type'
      }
    }
  },
  perform: (request, { settings, payload }) => {
    const url = `${trackApiEndpoint(settings.apiEndpoint)}/segmentio/event-processing`

    return request(url, {
      method: 'post',
      json: payload
    })
  }
}

export default action