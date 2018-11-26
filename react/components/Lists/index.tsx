import React, { Component, ReactNode } from 'react'
import ListItem from './ListItem'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { FormattedMessage } from 'react-intl'
import getList from '../../graphql/queries/getList.gql'
import { WISHLIST_STORAKE_KEY } from '../../'

interface ListsStates {
  listSelected: null
  lists: any[]
  loading: boolean
}

interface ListsProps {
  lists: any[]
  loadingLists: boolean
  client: ApolloClient<any>
}

class Lists extends Component<ListsProps, ListsStates> {
  state: ListsStates = {
    lists: [],
    loading: false,
    listSelected: null
  }

  public async componentDidMount() {
    const listsRefs = localStorage.getItem(WISHLIST_STORAKE_KEY)
    if (!listsRefs) {
      return this.setState({ loading: false })
    }
    const { client } = this.props
    const lists = await Promise.all(
      listsRefs.split(',').map((id: string) => {
        return client
          .query({
            query: getList,
            variables: {
              id
            }
          })
          .then(({ data: { list } }) => ({ ...list, id, loading: false }))
      })
    )
    this.setState({ lists, loading: false })
  }

  render = (): ReactNode => {
    const { loading, lists = [] } = this.state
    return (
      <div className="w-100">
        <div className="w-100 tc ttu f4 pv4 bb c-muted-1 b--muted-2">
        <FormattedMessage id="wishlist-my-lists" />
        </div>
        {loading && 'Carregando...'}
        {!loading &&
          lists.map(({ name, id }, key) => (
            <ListItem key={key} name={name} onClick={() => {}} isPublic />
          ))}
        {!loading && !lists.length && (
          <div className="tc pv4 c-muted-2">
            <FormattedMessage id="wishlist-no-lists" />
          </div>
        )}
      </div>
    )
  }
}

export default withApollo<ListsProps, {}>(Lists)
