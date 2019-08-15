import { Service, IOClients } from '@vtex/api'

import settingsResolver from './resolvers/settings'

// Export a service that defines route handlers and client options.
export default new Service<IOClients>({
  graphql: {
    resolvers: {
      Query: {
        appSettings: settingsResolver,
      },
    },
  },
})
