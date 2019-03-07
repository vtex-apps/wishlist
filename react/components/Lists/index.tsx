import React, { Component, ReactNode, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { injectIntl, intlShape } from 'react-intl'
import {
  getListsFromLocaleStorage,
  saveListIdInLocalStorage,
  deleteList
} from '../../GraphqlClient'
import { map, append, filter, update } from 'ramda'
import { translate } from '../../utils/translate'

import ListItem from '../ListItem'
import Header from '../Header'
import CreateList from '../CreateList'
import UpdateList from '../UpdateList'
import renderLoading from '../Loading'
import ListDetails from '../ListDetails/index'

const DEFAULT_LIST_INDEX = 0

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
  lists: any[]
  loadingLists: boolean
  client: ApolloClient<any>
  intl?: intlShape
  onClose: () => void
}

class Lists extends Component<ListsProps, ListsStates> {
  state: ListsStates = {
    lists: [],
    loading: true,
    show: true,
    listSelected: -1
  }

  public componentDidMount(): void {
    const { client } = this.props
    client && getListsFromLocaleStorage(client)
      .then(response => {
        const lists = map(item => item.data.list, response)
        this.setState({ loading: false, lists: lists })
      })
      .catch(() => this.setState({ loading: false }))
  }

  private handleDeleteList = (listId: string): Promise<any> => {
    const { lists } = this.state
    const { client } = this.props
    return deleteList(client, listId)
      .then(() => {
        this.setState({
          lists: filter(list => list.id !== listId, lists),
          showListDetails: false
        })
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
              <FormattedMessage id="wishlist-no-lists" />
            </div>
          )}
      </Fragment>
    )
  }

  private renderContent = (): ReactNode => {
    const { loading } = this.state
    return loading ? renderLoading() : this.renderLists()
  }

  render = (): ReactNode => {
    const {
      show,
      showCreateList,
      showUpdateList,
      showListDetails,
      listSelected,
      lists
    } = this.state
    const { onClose, intl } = this.props
    if (!show) return null
    return createPortal(
      (
        <Fragment>
          <div className="vw-100 vh-100 z-4 fixed bg-white top-0">
            <Header
              title={translate("wishlist-my-lists", intl)}
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
      ),
      document.body
    )
  }
}
export default injectIntl(withRuntimeContext(withApollo<ListsProps, {}>(Lists)))
