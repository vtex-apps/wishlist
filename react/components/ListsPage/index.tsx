import React, { Component, ReactNode } from 'react'

import ApolloClient from 'apollo-client'
import { map } from 'ramda'
import { withApollo, WithApolloClient } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import { getListsFromLocaleStorage } from '../../GraphqlClient'

import Footer from '../ListDetails/Footer'
import Header from './Header'
import ListSelector from './ListSelector'

interface ListsPageState {
  lists?: any
  selectedListId?: string
  isLoading?: boolean
}

interface ListsPageProps {
  client: ApolloClient<any>
  runtime: any
}

class ListsPage extends Component<ListsPageProps & WithApolloClient<any>, ListsPageState> {
  public state: ListsPageState = {}
  private isComponentMounted: boolean = false

  public componentWillUnmount(): void {
    this.isComponentMounted = false
  }

  public componentDidMount(): void {
    const { client, runtime: { route: { params } } } = this.props
    this.isComponentMounted = true

    if (client) {
      getListsFromLocaleStorage(client)
        .then((response: any) => {
          const lists = map(item => item.data.list, response)
          if (this.isComponentMounted) {
            this.setState({ isLoading: false, lists })
          }
        })
        .catch(() => {
          if (this.isComponentMounted) {
            this.setState({ isLoading: false })
          }
        })
    }

    this.setState({ selectedListId: params.listId })

  }

  public render(): ReactNode {
    console.log('lists state', this.state)
    return (
      <div className="flex flex-row ph10 pv8">
        <div>
          <ListSelector {...this.state} onListSelected={(listId: string) => this.setState({ selectedListId: listId })} />
        </div>
        <div className="w-100">
          <Header />
        </div>
      </div>
    )
  }
}

export default withRuntimeContext(withApollo(ListsPage))