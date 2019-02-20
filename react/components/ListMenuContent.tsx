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
import { map, append, filter, remove, indexOf, update } from 'ramda'
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
  changedLists: number[]
}

class ListMenuContent extends Component<ListMenuContentProps, ListMenuContentState> {
  public state: ListMenuContentState = {
    isLoading: true,
    lists: [],
    changedLists: []
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

  private addProductTochangedLists = (): void => {
    const { client, onClose, onAddToListsSuccess, onAddToListsFail } = this.props
    const { lists, changedLists } = this.state
    if (client) {
      this.setState({ isAdding: true })
      Promise.all(map(index => {
        const { id, name, isPublic, owner, items } = lists[index]
        return updateList(client, id, {
          name, isPublic, owner,
          items: ProductsToListItemInput(items)
        })
      }, changedLists))
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

  private containsProduct = (list: List): boolean => {
    const { product } = this.props
    return filter(item =>
      item.productId === product.productId &&
      item.skuId === product.skuId, list.items)
      .length > 0
  }

  private updateChangedLists = (listIndex: number, isSelected?: boolean): void => {
    const { changedLists } = this.state
    if (listIndex !== DEFAULT_LIST_INDEX) {
      const index = indexOf(listIndex, changedLists)
      const listsUpdated = !isSelected ?
        this.addProductToList(listIndex) :
        this.removeProductFromList(listIndex)
      let changedListsUpdated: any = []
      if (index !== -1) {
        changedListsUpdated = remove(index, 1, changedLists)
      } else {
        changedListsUpdated = append(listIndex, changedLists)
      }
      this.setState({ changedLists: changedListsUpdated, lists: listsUpdated })
    }
  }

  private addProductToList = (index: number): List[] => {
    const { product } = this.props
    const { lists } = this.state
    const list = lists[index]
    const listUpdated = { ...list, items: append(product, list.items) }
    return update(index, listUpdated, lists)
  }

  private removeProductFromList = (index: number): List[] => {
    const { product: { productId, skuId } } = this.props
    const { lists } = this.state
    const list = lists[index]
    const items = filter(item => item.productId !== productId || item.skuId !== skuId, list.items)
    return update(index, { ...list, items }, lists)
  }

  private renderSwitchLists = (): ReactNode => {
    const { lists } = this.state
    const { intl } = this.props
    return (
      <div className="flex flex-column">
        {
          lists.map((list: List, index: number) => (
            <ListItem
              key={index}
              id={index}
              list={list}
              isDefault={index === DEFAULT_LIST_INDEX}
              isSelected={index === DEFAULT_LIST_INDEX || this.containsProduct(list)}
              onClick={this.updateChangedLists} />
          ))
        }
        {lists && lists.length <= 1 && (
          <div className="pa6 flex items-center justify-center c-muted-1">
            <span>{translate("wishlist-no-list-created", intl)}</span>
          </div>
        )}
      </div>
    )
  }

  private renderMainContent = (): ReactNode => {
    const { isLoading } = this.state
    return isLoading ? this.renderLoading() : this.renderSwitchLists()
  }

  private renderFooter = (): ReactNode => {
    const { intl } = this.props
    const { changedLists, isAdding } = this.state
    return (
      <div className={wishlist.applyButton}>
        <Button
          vatiation="primary"
          disabled={!changedLists.length}
          block
          onClick={this.addProductTochangedLists}
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
        <div className={`${wishlist.contentContainer} overflow-y-auto`}>
          {this.renderMainContent()}
        </div>
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