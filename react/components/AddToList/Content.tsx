import React, { Component, ReactNode } from 'react'

import classNames from 'classnames'
import { append, filter, indexOf, map, path, remove, update } from 'ramda'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { isMobile } from 'react-device-detect'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { getListsFromLocaleStorage, updateList } from '../../GraphqlClient'

import CreateList from '../Form/CreateList'
import Header from '../Header'
import ListDetails from '../ListDetails'
import ListItem from '../ListItem'
import renderLoading from '../Loading'
import Footer from './Footer'

import styles from '../../wishList.css'

const DEFAULT_LIST_INDEX = 0
const QUANTITY_WITH_ONLY_DEFAULT_LIST = 1

interface AddToListContentProps
  extends InjectedIntlProps,
    WithApolloClient<{}> {
  product: ListItem
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
}

interface AddToListContentState {
  isLoading: boolean
  isAdding?: boolean
  showCreateList?: boolean
  lists: List[]
  changedLists: number[]
  showListDetails?: boolean
  selectedListId: string
}

class AddToListContent extends Component<
  AddToListContentProps,
  AddToListContentState
> {
  public state: AddToListContentState = {
    changedLists: [],
    isLoading: true,
    lists: [],
    selectedListId: '',
  }

  public componentDidMount(): void {
    const { client } = this.props
    getListsFromLocaleStorage(client)
      .then((response: ResponseList[]) => {
        const lists = map(item => item.data.list, response)
        this.setState({ isLoading: false, lists })
      })
      .catch(() => this.setState({ isLoading: false }))
  }

  public render(): ReactNode {
    const { onClose, intl } = this.props
    const {
      showCreateList,
      showListDetails,
      selectedListId,
      changedLists,
      isAdding,
      lists,
    } = this.state

    const className = classNames(styles.contentContainer, 'overflow-y-auto', {
      [styles.contentContainerMobile]: isMobile,
      [styles.contentContainerDesktop]: !isMobile,
    })
    return (
      <div className={`${styles.addToListContent} z-4 bg-base`}>
        <Header
          title={intl.formatMessage({ id: 'wishlist-add-to-list' })}
          onClose={onClose}
          action={() => this.setState({ showCreateList: true })}
        />
        <div className={className}>{this.renderMainContent()}</div>
        {lists && lists.length > QUANTITY_WITH_ONLY_DEFAULT_LIST && (
          <Footer
            changedLists={changedLists}
            isLoading={isAdding}
            onClick={this.handleAddProductTochangedLists}
          />
        )}
        {showCreateList && (
          <CreateList
            onFinishAdding={this.handleListCreated}
            onClose={() => this.setState({ showCreateList: false })}
          />
        )}
        {showListDetails && (
          <ListDetails
            listId={selectedListId}
            onClose={this.handleOnCloseListDetails}
            onDeleted={this.handleOnDeleted}
          />
        )}
      </div>
    )
  }

  private handleListCreated = (list: List): void => {
    const { lists } = this.state
    this.setState({ showCreateList: false, lists: append(list, lists) })
  }

  private handleAddProductTochangedLists = (): void => {
    const {
      client,
      onClose,
      onAddToListsSuccess,
      onAddToListsFail,
    } = this.props
    const { lists, changedLists } = this.state
    this.setState({ isAdding: true })
    Promise.all(
      map(index => {
        const { id } = lists[index]
        return updateList(client, id || '', { ...lists[index] })
      }, changedLists)
    )
      .then(() => {
        onClose()
        onAddToListsSuccess()
      })
      .catch(error => {
        console.error(error)
        onClose()
        onAddToListsFail()
      })
  }

  private containsProduct = (list: List): boolean => {
    const { product } = this.props
    return (
      filter(
        (item: ListItem) =>
          item.productId === product.productId && item.skuId === product.skuId,
        list.items || []
      ).length > 0
    )
  }

  private handleUpdateChangedLists = (
    listIndex: number,
    isSelected?: boolean
  ): void => {
    const { changedLists } = this.state
    if (listIndex !== DEFAULT_LIST_INDEX) {
      const index = indexOf(listIndex, changedLists)
      const listsUpdated = !isSelected
        ? this.addProductToList(listIndex)
        : this.removeProductFromList(listIndex)
      let changedListsUpdated: number[] = []
      if (index !== -1) {
        changedListsUpdated = remove(index, 1, changedLists)
      } else {
        changedListsUpdated = append(listIndex, changedLists)
      }
      this.setState({ changedLists: changedListsUpdated, lists: listsUpdated })
    }
  }

  private handleShowListDetails = (index: number): void => {
    const { lists } = this.state
    const listId: string = path(['id'], lists[index]) || ''
    this.setState({
      selectedListId: listId,
      showListDetails: true,
    })
  }

  private handleOnDeleted = (listId: string): void => {
    const { lists } = this.state
    const listsWithDeletedList = filter(
      list => path(['id'], list) !== listId,
      lists
    )
    this.setState({ lists: listsWithDeletedList })
  }

  private addProductToList = (index: number): List[] => {
    const { product } = this.props
    const { lists } = this.state
    const list = lists[index]
    const listUpdated = { ...list, items: append(product, list.items || []) }
    return update(index, listUpdated, lists)
  }

  private removeProductFromList = (index: number): List[] => {
    const {
      product: { productId, skuId },
    } = this.props
    const { lists } = this.state
    const list = lists[index]
    const items = filter(
      (item: ListItem) => item.productId !== productId || item.skuId !== skuId,
      list.items || []
    )
    return update(index, { ...list, items }, lists)
  }

  private handleOnCloseListDetails = (listUpdated?: List): void => {
    const { lists } = this.state
    const listsUpdated = listUpdated
      ? map(list => {
          if (list.id === listUpdated.id) {
            return listUpdated
          }
          return list
        }, lists)
      : lists
    this.setState({ showListDetails: false, lists: listsUpdated })
  }

  private renderSwitchLists = (): ReactNode => {
    const { lists } = this.state
    return (
      <div className={`${styles.addToListListsToSwitch} flex flex-column`}>
        {lists.map((list: List, index: number) => (
          <ListItem
            key={index}
            id={index}
            list={list}
            isDefault={index === DEFAULT_LIST_INDEX}
            isSelected={
              index === DEFAULT_LIST_INDEX || this.containsProduct(list)
            }
            onClick={this.handleShowListDetails}
            onSelected={this.handleUpdateChangedLists}
          />
        ))}
      </div>
    )
  }

  private renderMainContent = (): ReactNode => {
    const { isLoading } = this.state
    return isLoading ? renderLoading() : this.renderSwitchLists()
  }
}

export default compose(
  withApollo,
  injectIntl
)(AddToListContent)
