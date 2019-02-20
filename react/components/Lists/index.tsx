import React, { Component, ReactNode, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { FormattedMessage } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import { withRuntimeContext } from 'vtex.render-runtime'
import { injectIntl, intlShape } from 'react-intl'
import { getListsFromLocaleStorage, saveListIdInLocalStorage } from '../../GraphqlClient'
import { map, append } from 'ramda'
import { translate } from '../../utils/translate'

import ListItem from '../ListItem'
import Header from '../Header'
import CreateList from '../CreateList'

const DEFAULT_LIST_INDEX = 0

interface ListsStates {
  listSelected: null
  lists: any[]
  loading: boolean
  show: boolean
  showCreateList?: boolean
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
    listSelected: null,
    show: true,
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

  public goToListDetail = (id: string) => {
    this.setState({ show: false })
    const {
      runtime: { navigate },
    } = this.props
    navigate({ to: `/list/${id}` })
  }

  private onListCreated = (list: any): void => {
    const { lists } = this.state
    saveListIdInLocalStorage(list.id)
    this.setState({ showCreateList: false, lists: append(list, lists) })
  }

  private renderLoading = (): ReactNode => {
    return (
      <div className="flex justify-center pt4">
        <span className="dib c-muted-1">
          <Spinner color="currentColor" size={20} />
        </span>
      </div>
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
                  onClick={() => {
                    this.goToListDetail(list.id)
                  }}
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
    return loading ? this.renderLoading() : this.renderLists()
  }

  render = (): ReactNode => {
    const { loading, lists = [], show, showCreateList } = this.state
    const { onClose, intl } = this.props
    if (!show) return null
    return createPortal(
      (
        <Fragment>
          <div className="vw-100 vh-100 z-max fixed bg-white top-0">
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
          </div>

        </Fragment>
      ),
      document.body
    )
  }
}
export default injectIntl(withRuntimeContext(withApollo<ListsProps, {}>(Lists)))
