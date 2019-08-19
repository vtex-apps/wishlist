import settings from './graphql/queries/appSettings.gql'
import { graphql } from 'react-apollo'

const withSettings = graphql<{}, Settings>(settings, { name: 'settings' })

export default withSettings
