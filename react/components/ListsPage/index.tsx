import React, { Component, Fragment, ReactNode } from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'

import ApolloClient from 'apollo-client'
import { concat, filter, findIndex, map, update } from 'ramda'
import { withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'

import {
  createList,
  getListsFromLocaleStorage,
  saveListIdInLocalStorage,
} from '../../GraphqlClient'

import Content from './Content'
import ListSelector from './ListSelector'

import wishlist from '../../wishList.css'

const ON_LISTS_PAGE_CLASS = 'vtex-lists-page'

interface ListsPageState {
  lists?: any
  selectedListId?: string
  isLoading?: boolean
}

interface ListsPageProps {
  client: ApolloClient<any>
  runtime: any
  intl: IntlShape
}

class ListsPage extends Component<ListsPageProps & WithApolloClient<any> & InjectedIntlProps, ListsPageState> {
  public state: ListsPageState = {
    isLoading: true,
  }
  private isComponentMounted: boolean = false

  public componentWillUnmount(): void {
    this.isComponentMounted = false
    document.body.classList.remove(ON_LISTS_PAGE_CLASS)
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
    document.body.classList.add(ON_LISTS_PAGE_CLASS)
    this.isComponentMounted = true
    this.fetchLists()
  }

  public render(): ReactNode {
    const { selectedListId: id, lists, isLoading } = this.state
    const selectedListId = id || (lists && lists.length > 0 && lists[0].id)
    return (
      <div className={`${wishlist.listPage} flex flex-row mt6 ph10 pv8 h-100`}>
        {isLoading ? (
          <div className="flex justify-center w-100">
            <Spinner />
          </div>
        ) : (
            <Fragment>
              <div className="h-100 mr6">
                <ListSelector {...this.state} selectedListId={selectedListId} />
              </div>
              <div className="w-100">
                <Content
                  listId={selectedListId}
                  lists={lists}
                  onListCreated={this.onListCreated}
                  onListUpdated={this.onListUpdated}
                  onListDeleted={this.onListDeleted}
                />
              </div>
            </Fragment>
          )
        }
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
    const { client, runtime: { route: { params } }, intl } = this.props

    if (client) {
      getListsFromLocaleStorage(client)
        .then((response: any) => {
          const lists = map(item => item.data.list, response)
          if (this.isComponentMounted) {
            if (lists.length === 0) {
              createList(client, {
                isEditable: false,
                items: [],
                name: intl.formatMessage({ id: 'wishlist-default-list-name' }),
              })
                .then((r: any) => {
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

export default injectIntl(withRuntimeContext(withApollo(ListsPage)))