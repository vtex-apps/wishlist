import React, { Component, ReactNode } from 'react'

import ApolloClient from 'apollo-client'
import { concat, map } from 'ramda'
import { withApollo, WithApolloClient } from 'react-apollo'
import { withRuntimeContext } from 'vtex.render-runtime'
import { getListsFromLocaleStorage } from '../../GraphqlClient'

import Content from './Content'
import ListSelector from './ListSelector'
import findIndex from 'ramda/es/findIndex';
import update from 'ramda/es/update';

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

  public componentDidUpdate(prevProps: any): void {
    if (this.props !== prevProps) {
      const { runtime: { route: { params } } } = this.props
      this.setState({ selectedListId: params.listId })
    }
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
    const { selectedListId } = this.state
    return (
      <div className="flex flex-row ph10 pv8">
        <div>
          <ListSelector {...this.state} />
        </div>
        <div className="w-100">
          <Content
            listId={selectedListId}
            onListCreated={this.onListCreated}
            onListUpdated={this.onListUpdated}
          />
        </div>
      </div>
    )
  }

  private onListCreated = (list: List): void => {
    const { lists } = this.state
    this.setState({ lists: concat(lists, [list]) })
  }

  private onListUpdated = (listUpdated: List): void => {
    const { lists } = this.state
    const index = findIndex((list: List) => list.id === listUpdated.id, lists)
    this.setState({
      lists: update(index, listUpdated, lists),
    })
  }
}

export default withRuntimeContext(withApollo(ListsPage))