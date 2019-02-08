import React, { Component, ReactNode } from "react"
import { injectIntl, intlShape } from 'react-intl'
import { translate } from '../utils/translate'
import { Button, Spinner } from 'vtex.styleguide'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import {
  getListsFromLocaleStorage,
  saveListIdInLocalStorage,
  updateList,
  ProductsToListItemInput
} from '../GraphqlClient'
import { map, append, contains, remove, indexOf } from 'ramda'
import CreateList from './CreateList'
import Header from './Header'
import ListItem from './ListItem'

import wishlist from '../wishList.css'

const DEFAULT_LIST_INDEX = 0

interface List {
  id: string
  name: string
  isPublic: boolean
  owner: string
  items: any
}

interface ListMenuContentProps {
  product: any
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
  intl?: intlShape
  client?: ApolloClient<any>
}

interface ListMenuContentState {
  isLoading: boolean
  isAdding?: boolean
  showCreateList?: boolean
  lists: List[]
  selectedLists: number[]
}

class ListMenuContent extends Component<ListMenuContentProps, ListMenuContentState> {
  public state: ListMenuContentState = {
    isLoading: true,
    lists: [],
    selectedLists: []
  }

  public componentDidMount(): void {
    const { client } = this.props
    client && getListsFromLocaleStorage(client)
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

  private addProductToSelectedLists = (): void => {
    const { client, product, onClose, onAddToListsSuccess, onAddToListsFail } = this.props
    const { lists, selectedLists } = this.state
    if (client) {
      this.setState({ isAdding: true })
      Promise.all(map(index => {
        const { id, name, isPublic, owner, items } = lists[index]
        return updateList(client, id, {
          name, isPublic, owner,
          items: append(product, ProductsToListItemInput(items))
        })
      }, selectedLists))
      .then(() => {
        onClose()
        setTimeout(onAddToListsSuccess, 500)
      })
      .catch(err => {
        console.error('something went wrong', err)
        onClose()
        setTimeout(onAddToListsFail, 500)
      })
    }
  }

  private renderLoading = (): ReactNode => {
    return (
      <div className="w-100 h3 flex justify-center items-center">
        <Spinner />
      </div>
    )
  }

  private isSelected = (index: number): boolean => {
    const { selectedLists } = this.state
    return contains(index, selectedLists)
  }

  private handleListClicked = (listIndex: number): void => {
    if (listIndex !== DEFAULT_LIST_INDEX) {
      const { selectedLists } = this.state
      const index = indexOf(listIndex, selectedLists)
      if (index !== -1) {
        this.setState({ selectedLists: remove(index, 1, selectedLists) })
      } else {
        this.setState({ selectedLists: append(listIndex, selectedLists) })
      }
    }
  }

  private renderSwitchLists = (): ReactNode => {
    const { lists } = this.state
    return (
      <div className="flex flex-column">
        {
          lists.map((list: List, index: number) => (
            <ListItem
              key={index}
              id={index}
              list={list}
              isDefault={index === DEFAULT_LIST_INDEX}
              isSelected={index === DEFAULT_LIST_INDEX || this.isSelected(index)}
              onClick={this.handleListClicked} />
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
    const { selectedLists, isAdding } = this.state
    return (
      <div className={wishlist.applyButton}>
        <Button
          vatiation="primary"
          disabled={!selectedLists.length}
          block
          onClick={this.addProductToSelectedLists}
          isLoading={isAdding}
        >
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