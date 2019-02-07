import React, { Component, ReactNode } from "react"
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/translate'
import {
  Button,
  IconCheck,
  IconVisibilityOn,
  IconVisibilityOff,
  Spinner,
} from 'vtex.styleguide'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { getListsFromLocaleStorage, saveListIdInLocalStorage } from '../GraphqlClient'
import { map, append } from 'ramda'
import CreateList from './CreateList'
import Header from './Header'

import wishlist from '../wishList.css'

interface List {
  id: string
  name: string
  isPublic: boolean
  isSelected?: boolean
}

interface ListMenuContentProps {
  onClose: () => void
  intl: intlShape
  client: ApolloClient<any>
}

interface ListMenuContentState {
  isLoading: boolean
  showCreateList?: boolean
  lists: List[]
}

class ListMenuContent extends Component<ListMenuContentProps, ListMenuContentState> {
  public state: ListMenuContentState = {
    isLoading: true,
    lists: []
  }

  public componentDidMount(): void {
    const { client } = this.props
    getListsFromLocaleStorage(client)
      .then(response => {
        const lists = map(item => item.data.list, response)
        this.setState({ isLoading: false, lists: lists })
      })
      .catch(() => this.setState({ isLoading: false }))
  }

  private onListCreated = (list: any): void => {
    const { lists } = this.state
    saveListIdInLocalStorage(list.id)
    this.setState({ showCreateList: false, lists: append(list, lists) })
  }

  private renderLoading = (): ReactNode => {
    return (
      <div className="w-100 h3 flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  private renderSwitchLists = (): ReactNode => {
    const { lists } = this.state
    return (
      <div className="flex flex-column">
        {
          lists.map((list: List, index: number) => (
            <div key={list.id} className="w-100 bt b--muted-4 flex flex-row pv3 ph4 c-muted-3">
              <div className="flex items-center ml2">{list.isPublic ?
                <IconVisibilityOn />
                :
                <IconVisibilityOff />
              }
              </div>
              <span className="w-100 mh4 mv1 c-muted-1">{list.name}</span>
              <div className="flex items-center c-action-primary">{(list.isSelected || index === 0) && <IconCheck />}</div>
            </div>
          ))
        }
      </div>
    )
  }

  private renderMainContent = (): ReactNode => {
    const { isLoading } = this.state
    return isLoading ? this.renderLoading() : this.renderSwitchLists()
  }

  private renderFooter = (): ReactNode => {
    const { intl } = this.props
    return (
      <div className={wishlist.applyButton}>
        <Button vatiation="primary" block>
          {translate("wishlist-apply", intl)}
        </Button>
      </div>
    )
  }

  public render(): ReactNode {
    const { onClose, intl } = this.props
    const { showCreateList } = this.state
    return (
      <div className="w-100 bg-black fixed bottom-0 z-max bg-base">
        <Header
          title={translate('wishlist-add-to-list', intl)}
          onClose={onClose}
          action={() => this.setState({ showCreateList: true })}
        />
        {this.renderMainContent()}
        {this.renderFooter()}
        {showCreateList && (
          <CreateList
            onFinishAdding={this.onListCreated}
            onClose={() => this.setState({ showCreateList: false })}
          />
        )}
      </div>
    )
  }
}

export default withApollo<ListMenuContentProps, {}>(injectIntl(ListMenuContent))