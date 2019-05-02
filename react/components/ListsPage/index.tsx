import React, { Component, Fragment, ReactNode } from 'react'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'

import { concat, filter, findIndex, map, update } from 'ramda'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'

import {
  createList,
  getListsFromLocaleStorage,
  saveListIdInLocalStorage,
} from '../../GraphqlClient'

import Content from './Content'
import ListSelector from './ListSelector'

import styles from '../../wishList.css'

const ON_LISTS_PAGE_CLASS = 'vtex-lists-page'

interface ListsPageState {
  lists: List[]
  selectedListId?: string
  isLoading?: boolean
}

interface ListsPageProps extends InjectedIntlProps, WithApolloClient<{}> {
  runtime: Runtime
}

class ListsPage extends Component<ListsPageProps, ListsPageState> {
  public state: ListsPageState = {
    isLoading: true,
    lists: [],
  }
  private isComponentMounted: boolean = false

  public componentWillUnmount(): void {
    this.isComponentMounted = false
    document.body.classList.remove(ON_LISTS_PAGE_CLASS)
  }

  public componentDidUpdate(prevProps: ListsPageProps): void {
    const {
      runtime: {
        route: { params },
      },
      client,
    } = this.props
    if (client && prevProps.runtime.route.params.listId !== params.listId) {
      this.setState({ selectedListId: params.listId })
      getListsFromLocaleStorage(client)
        .then((response: ResponseList[]) => {
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
  }

  public componentDidMount(): void {
    document.body.classList.add(ON_LISTS_PAGE_CLASS)
    this.isComponentMounted = true
    this.fetchLists()
  }

  public render(): ReactNode {
    const { selectedListId: id, lists, isLoading } = this.state
    const selectedListId = id || (lists.length > 0 && lists[0].id)
    return (
      <div className={`${styles.listPage} flex flex-row mt6 ph10 pv8 h-100`}>
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
                onListCreated={this.handleListCreated}
                onListUpdated={this.handleListUpdated}
                onListDeleted={this.handleListDeleted}
              />
            </div>
          </Fragment>
        )}
      </div>
    )
  }

  private handleListCreated = (list: List): void => {
    const { lists } = this.state
    this.setState({ lists: concat(lists, [list]) })
  }

  private handleListUpdated = (listUpdated: List): void => {
    const { lists } = this.state
    const index = findIndex((list: List) => list.id === listUpdated.id, lists)
    this.setState({
      lists: update(index, listUpdated, lists),
    })
  }

  private onListDeleted = (): void => {
    const { lists, selectedListId } = this.state
    const {
      runtime: { navigate },
    } = this.props
    const listsUpdate = filter((list: List) => list !== selectedListId, lists)
    this.setState({ lists: listsUpdate })
    navigate({
      page: 'store.lists',
      params: { listId: lists[0].id },
    })
  }

  private fetchLists = (): void => {
    const {
      client,
      runtime: {
        route: { params },
      },
      intl,
    } = this.props

    getListsFromLocaleStorage(client)
      .then((response: ResponseList[]) => {
        const lists = map(item => item.data.list, response)
        if (this.isComponentMounted) {
          if (lists.length === 0) {
            createList(client, {
              isEditable: false,
              items: [],
              name: intl.formatMessage({ id: 'wishlist-default-list-name' }),
            }).then((responseCreateList: ResponseList) => {
              const list = responseCreateList.data.createList
              this.setState({
                isLoading: false,
                lists: [list],
                selectedListId: list.id,
              })
              saveListIdInLocalStorage(list.id)
            })
          } else {
            this.setState({
              isLoading: false,
              lists,
              selectedListId: params.listId,
            })
          }
        }
      })
      .catch(() => {
        if (this.isComponentMounted) {
          this.setState({ isLoading: false })
        }
      })
  }
}

export default compose(
  injectIntl,
  withRuntimeContext,
  withApollo
)(ListsPage)
