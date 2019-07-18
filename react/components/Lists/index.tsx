import React, { Component, Fragment, ReactNode } from 'react'

import { append, filter, update, isEmpty } from 'ramda'
import { compose, withApollo, WithApolloClient, graphql } from 'react-apollo'
import { createPortal } from 'react-dom'
import {
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
  defineMessages,
} from 'react-intl'
import { session } from 'vtex.store-resources/Queries'

import { withRuntimeContext, withSession } from 'vtex.render-runtime'
import { deleteList } from '../../GraphqlClient'

import CreateList from '../Form/CreateList'
import UpdateList from '../Form/UpdateList'
import Header from '../Header'
import ListDetails from '../ListDetails/index'
import ListItem from '../ListItem'
import renderLoading from '../Loading'
import Screen from '../Screen'

import styles from '../../wishList.css'

const DEFAULT_LIST_INDEX = 0
const OPEN_LISTS_CLASS = styles.open
const messages = defineMessages({
  myLists: {
    defaultMessage: '',
    id: 'store/wishlist-my-lists',
  },
  noListCreated: {
    defaultMessage: '',
    id: 'store/wishlist-no-list-created',
  },
})

interface ListsState {
  listSelected: number
  showCreateList?: boolean
  showUpdateList?: boolean
  showListDetails?: boolean
  lists?: List[]
}

interface ListsProps extends InjectedIntlProps, WithApolloClient<{}> {
  onClose: () => void
  session: Session
  lists: List[]
  loading?: boolean
}

class Lists extends Component<ListsProps, ListsState> {
  public state: ListsState = {
    listSelected: -1,
  }

  private isComponentMounted: boolean = false

  public componentWillUnmount() {
    this.isComponentMounted = false
    document.body.classList.remove(OPEN_LISTS_CLASS)
  }

  public componentDidMount(): void {
    this.isComponentMounted = true
    this.setState({ this.props.lists })
  }

  public render = (): ReactNode => {
    const {
      showCreateList,
      showUpdateList,
      showListDetails,
      listSelected,
      lists,
    } = this.state
    const { onClose, intl } = this.props

    return createPortal(
      <Screen>
        <Header
          title={intl.formatMessage(messages.myLists)}
          onClose={onClose}
          action={() => this.setState({ showCreateList: true })}
        />
        {this.renderContent()}
        {showCreateList && (
          <div className="fixed vw-100 top-0 bg-base">
            <CreateList
              onClose={() => this.setState({ showCreateList: false })}
              onFinishAdding={this.handleListCreated}
            />
          </div>
        )}
        {showUpdateList && (
          <Screen>
            <UpdateList
              onClose={() => this.setState({ showUpdateList: false })}
              list={lists && lists[listSelected]}
              onFinishUpdate={this.handleListUpdated}
            />
          </Screen>
        )}
        {showListDetails && (
          <div className="fixed vw-100 top-0 left-0 bg-base">
            <ListDetails
              onClose={() => this.setState({ showListDetails: false })}
              listId={lists && lists[listSelected].id}
              onDeleted={this.handleDeleteList}
            />
          </div>
        )}
      </Screen>,
      document.body
    )
  }

  private renderLists = (): ReactNode => {
    const { lists } = this.state
    return (
      <Fragment>
        {lists && !isEmpty(lists) ? (
          <div className="bb b--muted-4 h-100 overflow-auto">
            {lists.map((list, key) => (
              <ListItem
                key={key}
                list={list}
                id={key}
                isDefault={key === DEFAULT_LIST_INDEX}
                onClick={() =>
                  this.setState({ showListDetails: true, listSelected: key })
                }
                showMenuOptions
                onDeleted={this.handleDeleteList}
                onUpdated={this.handleUpdateList}
              />
            ))}
          </div>
        ) : (
          <div className="tc pv4 c-muted-2">
            <FormattedMessage {...messages.noListCreated} />
          </div>
        )}
      </Fragment>
    )
  }

  private handleDeleteList = (listId: string): Promise<void> => {
    const { client } = this.props
    const { lists } = this.state
    return deleteList(client, listId)
      .then(() => {
        if (this.isComponentMounted) {
          this.setState({
            lists: filter(list => list.id !== listId, lists || []),
            showListDetails: false,
          })
        }
      })
      .catch(error => console.error(error))
  }

  private handleUpdateList = (index: number): void => {
    this.setState({ listSelected: index, showUpdateList: true })
  }

  private handleListCreated = (list: List): void => {
    const { lists } = this.state
    this.setState({ showCreateList: false, lists: append(list, lists || []) })
  }

  private handleListUpdated = (list: List): void => {
    const { lists, listSelected } = this.state
    this.setState({
      lists: update(listSelected, list, lists || []),
      showUpdateList: false,
    })
  }

  private renderContent = (): ReactNode => {
    const { loading } = this.props
    return loading ? renderLoading() : this.renderLists()
  }
}

const options = {
  name: 'session',
  options: () => ({ ssr: false }),
}

export default withSession()(
  compose(
    injectIntl,
    withRuntimeContext,
    withApollo,
    graphql(session, options)
  )(Lists)
)
