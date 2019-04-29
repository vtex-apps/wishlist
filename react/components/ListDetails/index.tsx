import React, { Component, Fragment, ReactNode } from 'react'

import { append, filter, map } from 'ramda'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { orderFormConsumer } from 'vtex.store-resources/OrderFormContext'
import { deleteList, getListDetailed, updateList } from '../../GraphqlClient'
import DialogMessage from '../Dialog/DialogMessage'
import UpdateList from '../Form/UpdateList'
import Header from '../Header'
import renderLoading from '../Loading'
import MenuOptions from '../MenuOptions/MenuOptions'
import Content from './Content'
import Footer from './Footer'

interface ListDetailState {
  list?: any
  isLoading: boolean
  isAddingToCart?: boolean
  selectedItems: any
  showDeleteConfirmation?: boolean
  showUpdateList?: boolean
}

interface ListDetailProps extends InjectedIntlProps, WithApolloClient<any> {
  listId: string
  onClose: (lists?: any) => void
  onDeleted?: (id: string) => void
  orderFormContext?: any
}

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  public state: ListDetailState = {
    isLoading: true,
    selectedItems: [],
  }
  private isComponentMounted: boolean = false

  public componentDidMount(): void {
    const { listId, client } = this.props
    this.isComponentMounted = true
    getListDetailed(client, listId)
      .then(response => {
        if (this.isComponentMounted) {
          this.setState({ list: response.data.list, isLoading: false })
        }
      })
      .catch(err => console.error(err))
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public render(): ReactNode {
    const { list, isLoading, showDeleteConfirmation, showUpdateList } = this.state
    const { intl, listId } = this.props
    return (
      <div className="fixed top-0 left-0 vw-100 vh-100 flex flex-column z-4 bg-base">
        {isLoading ? renderLoading() : this.renderContent()}
        {showDeleteConfirmation && (
          <DialogMessage
            message={
              intl.formatMessage(
                { id: 'wishlist-delete-confirmation-message' },
                { listName: list.name }
              )
            }
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

  private renderContent = (): ReactNode => {
    const { list: { items, name }, selectedItems } = this.state
    const options: Option[] = [
      {
        disabled: !this.state.isLoading && !this.state.list.isEditable,
        onClick: () => this.setState({ showUpdateList: true }),
        title: this.props.intl.formatMessage({ id: 'wishlist-option-configuration' }),
      },
      {
        disabled: !this.state.isLoading && !this.state.list.isEditable,
        onClick: () => this.setState({ showDeleteConfirmation: true }),
        title: this.props.intl.formatMessage({ id: 'wishlist-option-delete' }),
      },
    ]

    return (
      <Fragment>
        <Header
          title={name}
          onClose={this.handleOnClose}
          showIconBack
        >
          <MenuOptions options={options} />
        </Header>
        <Content
          items={items}
          onItemSelect={this.onItemSelectedChange}
          onItemRemove={this.onItemRemove}
        />
        {items.length > 0 && (
          <Footer
            items={selectedItems}
          />
        )}
      </Fragment>
    )
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
        if (this.isComponentMounted) {
          this.setState({
            list: listUpdated,
            selectedItems: filter(({ itemId: id }) => id !== itemId, selectedItems),
          })
        }
      })
  }

  private onFinishUpdate = (list: List): void => {
    this.setState({ list, showUpdateList: false })
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
    deleteList(client, listId)
      .then(() => {
        if (onDeleted) {
          onDeleted(listId)
        }
        onClose()
      })
      .catch(error => console.error(error))
  }

}

export default compose(
  withApollo,
  orderFormConsumer,
  injectIntl
)(ListDetail)
