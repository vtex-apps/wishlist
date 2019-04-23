import React, { Component, ReactNode } from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'

import ApolloClient from 'apollo-client'
import { concat, filter, findIndex, map, update } from 'ramda'
import { withApollo, WithApolloClient } from 'react-apollo'
import { createList, getListsFromLocaleStorage, saveListIdInLocalStorage } from '../../GraphqlClient'

import Content from './Content'
import ListSelector from './ListSelector'

import wishlist from '../../wishList.css'

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
      const { runtime: { route: { params } }, client } = this.props
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
  }

  public componentDidMount(): void {
    this.isComponentMounted = true
    this.fetchLists()
  }

  public render(): ReactNode {
    const { selectedListId: id, lists } = this.state
    const selectedListId = id || (lists && lists.length > 0 && lists[0].id)
    return (
      <div className={`${wishlist.listPage} flex flex-row ph10 pv8 h-100`}>
        <div>
          <ListSelector {...this.state} selectedListId={selectedListId} />
        </div>
        <div className="w-100">
          <Content
            listId={selectedListId}
            onListCreated={this.onListCreated}
            onListUpdated={this.onListUpdated}
            onListDeleted={this.onListDeleted}
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

  private onListDeleted = (): void => {
    const { lists, selectedListId } = this.state
    const { runtime: { navigate } } = this.props
    const listsUpdate = filter((list: List) => list !== selectedListId, lists)
    this.setState({ lists: listsUpdate })
    navigate({
      page: 'store.lists',
      params: { listId: lists[0].id },
    })
  }

  private fetchLists = (): void => {
    const { client, runtime: { route: { params } } } = this.props

    if (client) {
      getListsFromLocaleStorage(client)
        .then((response: any) => {
          const lists = map(item => item.data.list, response)
          if (this.isComponentMounted) {
            if (lists.length === 0) {
              createList(client, { name: 'all items', items: [] }).then((r: any) => {
                this.setState({
                  isLoading: false,
                  lists: [r.data.createList],
                  selectedListId: r.data.createList.id,
                })
                saveListIdInLocalStorage(r.data.createList.id)
              })
            } else {
              this.setState({ isLoading: false, lists, selectedListId: params.listId })
            }
          }
        })
        .catch(() => {
          if (this.isComponentMounted) {
            this.setState({ isLoading: false })
          }
        })
    } else {
      this.fetchLists()
    }
  }
}

export default withRuntimeContext(withApollo(ListsPage))