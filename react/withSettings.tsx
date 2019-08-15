import settings from './graphql/queries/appSettings.gql'
import { graphql } from 'react-apollo'

export interface Settings {
  enableMultipleLists: boolean
  defaultListName: string
}

const withSettings = graphql<{}, Settings>(settings)

export default withSettings
