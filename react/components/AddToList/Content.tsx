import { ApolloClient } from 'apollo-client'
import { append, filter, indexOf, map, remove, update, path } from 'ramda'
import React, { Component, ReactNode } from "react"
import { withApollo } from 'react-apollo'
import { injectIntl, intlShape } from 'react-intl'
import {
  getListsFromLocaleStorage,
  saveListIdInLocalStorage,
  updateList
} from '../../GraphqlClient'
import { translate } from '../../utils/translate'
import wishlist from '../../wishList.css'
import CreateList from '../Form/CreateList'
import Header from '../Header'
import ListItem from '../ListItem'
import renderLoading from '../Loading'
import ListDetails from '../ListDetails'
import Footer from './Footer'

const DEFAULT_LIST_INDEX = 0
const QUANTITY_WITH_ONLY_DEFAULT_LIST = 1

interface AddToListContentProps {
  product: any
  onClose: () => void
  onAddToListsSuccess: () => void
  onAddToListsFail: () => void
  intl?: intlShape
  client?: ApolloClient<any>
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

class AddToListContent extends Component<AddToListContentProps, AddToListContentState> {
  public state: AddToListContentState = {
    isLoading: true,
    lists: [],
    changedLists: [],
    selectedListId: '',
  }

  public componentDidMount(): void {
    const { client } = this.props
    client && getListsFromLocaleStorage(client)
      .then((response: any) => {
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
        const { id } = lists[index]
        return updateList(client, id, { ...lists[index] })
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

  private containsProduct = (list: List): boolean => {
    const { product } = this.props
    return filter((item: Item) =>
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

  private handleShowListDetails = (index: number): void => {
    const { lists } = this.state
    const listId: string = path(['id'], lists[index]) || ''
    this.setState({
      showListDetails: true,
      selectedListId: listId,
    })
  }

  private handleOnDeleted = (listId: string): void => {
    const { lists } = this.state
    const listsWithDeletedList = filter(list => path(['id'], list) !== listId, lists)
    this.setState({ lists: listsWithDeletedList })
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

  private handleOnCloseListDetails = (listUpdated?: any): void => {
    const { lists } = this.state
    const listsUpdated = listUpdated ? map(list => {
      if (list.id === listUpdated.id) {
        return listUpdated
      }
      return list
    }, lists) : lists
    this.setState({ showListDetails: false, lists: listsUpdated })
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
              isSelected={index === DEFAULT_LIST_INDEX || this.containsProduct(list)}
              onClick={this.handleShowListDetails}
              onSelected={this.updateChangedLists} />
          ))
        }
      </div>
    )
  }

  private renderMainContent = (): ReactNode => {
    const { isLoading } = this.state
    return isLoading ? renderLoading() : this.renderSwitchLists()
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
    return (
      <div className="z-4 bg-base">
        <Header
          title={translate('wishlist-add-to-list', intl)}
          onClose={onClose}
          action={() => this.setState({ showCreateList: true })}
        />
        <div className={`${wishlist.contentContainer} overflow-y-auto`}>
          {this.renderMainContent()}
        </div>
        {lists && lists.length > QUANTITY_WITH_ONLY_DEFAULT_LIST && (
          <Footer
            changedLists={changedLists}
            isLoading={isAdding}
            onClick={this.addProductTochangedLists}
          />
        )}
        {showCreateList && (
          <CreateList
            onFinishAdding={this.onListCreated}
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
}

export default withApollo<AddToListContentProps, {}>(injectIntl(AddToListContent))