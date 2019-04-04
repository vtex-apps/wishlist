import { ApolloClient } from 'apollo-client'
import { append, filter, map, update } from 'ramda'
import React, { Component, Fragment, ReactNode } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { createPortal } from 'react-dom'
import { FormattedMessage, InjectedIntlProps } from 'react-intl'
import { injectIntl, IntlShape } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  deleteList,
  getListsFromLocaleStorage,
  saveListIdInLocalStorage
} from '../../GraphqlClient'

import CreateList from '../Form/CreateList'
import UpdateList from '../Form/UpdateList'
import Header from '../Header'
import ListDetails from '../ListDetails/index'
import ListItem from '../ListItem'
import renderLoading from '../Loading'

import wishlist from '../../wishList.css'

const DEFAULT_LIST_INDEX = 0
const OPEN_LISTS_CLASS = wishlist.open

interface ListsStates {
  listSelected: number
  lists: any[]
  loading: boolean
  show: boolean
  showCreateList?: boolean
  showUpdateList?: boolean
  showListDetails?: boolean
}

interface ListsProps {
  onClose: () => void,
  intl?: IntlShape,
  client?: ApolloClient<any>
}

class Lists extends Component<ListsProps & InjectedIntlProps & WithApolloClient<{}>, ListsStates> {
  public state: ListsStates = {
    listSelected: -1,
    lists: [],
    loading: true,
    show: true,
  }

  private isComponentMounted: boolean = false

  public componentWillUnmount() {
    this.isComponentMounted = false
    document.body.classList.remove(OPEN_LISTS_CLASS)
  }

  public componentDidMount(): void {
    const { client } = this.props
    this.isComponentMounted = true
    document.body.classList.add(OPEN_LISTS_CLASS)
    getListsFromLocaleStorage(client)
      .then(response => {
        const lists = map(item => item.data.list, response)
        if (this.isComponentMounted) {
          this.setState({ loading: false, lists })
        }
      })
      .catch(() => this.isComponentMounted && this.setState({ loading: false }))
  }

  public render = (): ReactNode => {
    const {
      show,
      showCreateList,
      showUpdateList,
      showListDetails,
      listSelected,
      lists,
    } = this.state
    const { onClose, intl } = this.props
    if (!show) { return null }
    return (
      <Fragment>
        <div className="vw-100 vh-100 z-4 fixed bg-white top-0">
          <Header
            title={intl.formatMessage({ id: 'wishlist-my-lists' })}
            onClose={onClose}
            action={() => this.setState({ showCreateList: true })}
          />
          {this.renderContent()}
          {showCreateList && (
            <div className="fixed vw-100 top-0 bg-base">
              <CreateList
                onClose={() => this.setState({ showCreateList: false })}
                onFinishAdding={this.onListCreated}
              />
            </div>
          )}
          {showUpdateList && (
            <div className="fixed vw-100 top-0 left-0 bg-base">
              <UpdateList
                onClose={() => this.setState({ showUpdateList: false })}
                list={lists[listSelected]}
                onFinishUpdate={this.onListUpdated}
              />
            </div>
          )}
          {showListDetails && (
            <div className="fixed vw-100 top-0 left-0 bg-base">
              <ListDetails
                onClose={() => this.setState({ showListDetails: false })}
                listId={lists[listSelected].id}
                onDeleted={this.handleDeleteList}
              />
            </div>
          )}
        </div>

      </Fragment>
    )
  }

  private renderLists = (): ReactNode => {
    const { lists } = this.state
    return (
      <Fragment>
        {lists.length ?
          (
            <div className="bb b--muted-4">
              {lists.map((list, key) => (
                <ListItem
                  key={key}
                  list={list}
                  id={key}
                  isDefault={key === DEFAULT_LIST_INDEX}
                  onClick={() => this.setState({ showListDetails: true, listSelected: key })}
                  showMenuOptions
                  onDeleted={this.handleDeleteList}
                  onUpdated={this.handleUpdateList}
                />
              ))}
            </div>
          ) : (
            <div className="tc pv4 c-muted-2">
              <FormattedMessage id="wishlist-no-list-created" />
            </div>
          )}
      </Fragment>
    )
  }

  private handleDeleteList = (listId: string): Promise<any> => {
    const { lists } = this.state
    const { client } = this.props
    return deleteList(client, listId)
      .then(() => {
        if (this.isComponentMounted) {
          this.setState({
            lists: filter(list => list.id !== listId, lists),
            showListDetails: false,
          })
        }
      })
      .catch(err => console.error('something went wrong', err))
  }

  private handleUpdateList = (index: number): void => {
    this.setState({ listSelected: index, showUpdateList: true })
  }

  private onListCreated = (list: any): void => {
    const { lists } = this.state
    saveListIdInLocalStorage(list.id)
    this.setState({ showCreateList: false, lists: append(list, lists) })
  }

  private onListUpdated = (list: any): void => {
    const { lists, listSelected } = this.state
    this.setState({ lists: update(listSelected, list, lists), showUpdateList: false })
  }

  private renderContent = (): ReactNode => {
    const { loading } = this.state
    return loading ? renderLoading() : this.renderLists()
  }

}
export default withRuntimeContext(withApollo<ListsProps, {}>(injectIntl(Lists)))
