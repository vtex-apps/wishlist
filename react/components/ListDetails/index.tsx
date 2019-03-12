import React, { Component, ReactNode, Fragment } from 'react'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { injectIntl, intlShape } from 'react-intl'
import { append, filter, map, path } from 'ramda'
import { orderFormConsumer } from 'vtex.store-resources/OrderFormContext'
import Header from '../Header'
import renderLoading from '../Loading'
import MenuOptions from '../MenuOptions/MenuOptions'
import { translate } from '../../utils/translate'
import Footer from './Footer'
import Content from './Content'
import Dialog from '../Dialog'
import UpdateList from '../Form/UpdateList'

import { getListDetailed, updateList, deleteList } from '../../GraphqlClient'

enum Size {
  large, small
}

interface ListDetailState {
  list?: List
  isLoading: boolean
  isAddingToCart?: boolean
  selectedItems: any
  showDeleteConfirmation?: boolean
  showUpdateList?: boolean
}

interface ListDetailProps {
  listId: string
  onClose: (lists?: any) => void
  onDeleted?: (id: string) => void
  client?: ApolloClient<any>
  orderFormContext?: any
  intl?: intlShape
}

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  state: ListDetailState = {
    isLoading: true,
    selectedItems: []
  }

  private options: Option[] = [
    {
      title: translate('wishlist-option-configuration', this.props.intl),
      onClick: () => this.setState({ showUpdateList: true })
    },
    {
      title: translate('wishlist-option-delete', this.props.intl),
      onClick: () => this.setState({ showDeleteConfirmation: true })
    },
  ]

  createItemShapeFromItem = ({ product: { items } }: any) => {
    const sku = items[0]
    return {
      quantity: 1,
      seller: Number(sku.sellers[0].sellerId),
      id: Number(sku.itemId),
    }
  }

  public addItensToCart = (): Promise<any> => {
    const { orderFormContext } = this.props
    const { selectedItems } = this.state

    this.setState({ isAddingToCart: true })
    return orderFormContext
      .addItem({
        variables: {
          orderFormId: path(['orderForm', 'orderFormId'], orderFormContext),
          items: map(this.createItemShapeFromItem, selectedItems),
        },
      })
      .then(() => {
        this.setState({ isAddingToCart: false })
        orderFormContext.refetch()
      })
  }

  private onItemSelectedChange = (itemId: string, product: any, isSelected: boolean) => {
    const { selectedItems } = this.state
    if (isSelected) {
      this.setState({ selectedItems: append({ itemId, product }, selectedItems) })
    } else {
      this.setState({ selectedItems: filter(({ itemId: id }) => id !== itemId, selectedItems) })
    }
  }

  private itemWithoutProduct =
    ({ id, productId, skuId, quantity }: any): any => ({ id, productId, skuId, quantity })

  private onItemRemove = (itemId: string): Promise<any> => {
    const { client, listId } = this.props
    const { list, list: { items }, selectedItems } = this.state
    const listUpdated = { ...list, items: filter(({ id }) => id !== itemId, items) }
    const itemsUpdated = map(item => this.itemWithoutProduct(item), listUpdated.items)
    return updateList(client, listId, { ...list, items: itemsUpdated })
      .then(() => {
        this.setState({
          list: listUpdated,
          selectedItems: filter(({ itemId: id }) => id !== itemId, selectedItems)
        })
      })
  }

  private onFinishUpdate = (list: List): void => {
    this.setState({ list: list, showUpdateList: false })
  }

  public componentDidMount(): void {
    const { listId, client } = this.props
    client && getListDetailed(client, listId)
      .then(response => {
        this.setState({ list: response.data.list, isLoading: false })
      })
      .catch(err => console.error('Something went wrong', err))
  }

  private handleOnClose = (): void => {
    const { list } = this.state
    const { onClose } = this.props
    const currentList = {
      ...list,
      items: map(item => this.itemWithoutProduct(item), list.items)
    }
    onClose(currentList)
  }

  private handleDeleteList = (): void => {
    const { client, listId, onDeleted, onClose } = this.props
    client && deleteList(client, listId)
      .then(() => {
        onDeleted && onDeleted(listId)
        onClose()
      })
      .catch(error => console.error('Something went wrong', error))
  }

  private renderContent = (): ReactNode => {
    const { list: { name, items }, selectedItems } = this.state
    return (
      <Fragment>
        <Header
          title={name}
          onClose={this.handleOnClose}
          showIconBack
        >
          <MenuOptions options={this.options} size={Size.large} />
        </Header>
        <Content
          items={items}
          onItemSelect={this.onItemSelectedChange}
          onItemRemove={this.onItemRemove}
        />
        {items.length > 0 && (
          <Footer
            items={selectedItems}
            onAddToCart={this.addItensToCart}
          />
        )}
      </Fragment>
    )
  }

  public render(): ReactNode {
    const { list, isLoading, showDeleteConfirmation, showUpdateList } = this.state
    const { intl, listId } = this.props
    return (
      <div className="fixed top-0 left-0 vw-100 vh-100 flex flex-column z-4 bg-base">
        {isLoading ? renderLoading() : this.renderContent()}
        {showDeleteConfirmation && (
          <Dialog
            message={`${translate("wishlist-delete-confirmation-message", intl)} "${list.name}"?`}
            onClose={() => this.setState({ showDeleteConfirmation: false })}
            onSuccess={this.handleDeleteList}
          />
        )}
        {showUpdateList && (
          <div className="fixed top-0 left-0 w-100 bg-base">
            <UpdateList
              onClose={() => this.setState({ showUpdateList: false })}
              list={{ ...list, id: listId }}
              onFinishUpdate={this.onFinishUpdate}
            />
          </div>
        )}
      </div>
    )
  }
}

export default withApollo<ListDetailProps, {}>(orderFormConsumer(injectIntl(ListDetail)))
