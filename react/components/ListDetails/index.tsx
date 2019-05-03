import React, { Component, Fragment, ReactNode } from 'react'
import { ActionMenu, IconOptionsDots } from 'vtex.styleguide'

import { append, filter, map } from 'ramda'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { deleteList, getListDetailed, updateList } from '../../GraphqlClient'
import DialogMessage from '../Dialog/DialogMessage'
import UpdateList from '../Form/UpdateList'
import Header from '../Header'
import renderLoading from '../Loading'
import Content from './Content'
import Footer from './Footer'

interface ListDetailState {
  list: List
  isLoading: boolean
  isAddingToCart?: boolean
  selectedItems: ListItemWithProduct[]
  showDeleteConfirmation?: boolean
  showUpdateList?: boolean
}

interface ListDetailProps
  extends InjectedIntlProps,
    WithApolloClient<ResponseList> {
  listId: string
  onClose: (lists?: List[]) => void
  onDeleted?: (id: string) => void
}

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  public state: ListDetailState = {
    list: {},
    isLoading: true,
    selectedItems: [],
  }
  private isComponentMounted: boolean = false

  public componentDidMount(): void {
    const { listId, client } = this.props
    this.isComponentMounted = true
    getListDetailed(client, listId)
      .then((response: ResponseList) => {
        if (this.isComponentMounted) {
          this.setState({ list: response.data.list, isLoading: false })
        }
        return response
      })
      .catch((err: {}) => console.error(err))
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public render(): ReactNode {
    const {
      list,
      isLoading,
      showDeleteConfirmation,
      showUpdateList,
    } = this.state
    const { intl, listId } = this.props
    return (
      <div className="fixed top-0 left-0 vw-100 vh-100 flex flex-column z-4 bg-base">
        {isLoading ? renderLoading() : this.renderContent()}
        {showDeleteConfirmation && (
          <DialogMessage
            message={intl.formatMessage(
              { id: 'wishlist-delete-confirmation-message' },
              { listName: list.name }
            )}
            onClose={() => this.setState({ showDeleteConfirmation: false })}
            onSuccess={this.handleDeleteList}
          />
        )}
        {showUpdateList && (
          <div className="fixed top-0 left-0 w-100 bg-base">
            <UpdateList
              onClose={() => this.setState({ showUpdateList: false })}
              list={{ ...list, id: listId }}
              onFinishUpdate={this.handleFinishUpdate}
            />
          </div>
        )}
      </div>
    )
  }

  private renderContent = (): ReactNode => {
    const { list, selectedItems, isLoading } = this.state

    const options = [
      {
        onClick: () => this.setState({ showUpdateList: true }),
        label: this.props.intl.formatMessage({
          id: 'wishlist-option-configuration',
        }),
      },
      {
        onClick: () => this.setState({ showDeleteConfirmation: true }),
        label: this.props.intl.formatMessage({ id: 'wishlist-option-delete' }),
      },
    ]

    return (
      <Fragment>
        <Header title={list.name} onClose={this.handleOnClose} showIconBack>
          {!isLoading && list.isEditable && (
            <ActionMenu
              options={options}
              hideCaretIcon
              buttonProps={{
                variation: 'tertiary',
                size: 'small',
                icon: <IconOptionsDots />,
              }}
            />
          )}
        </Header>
        <Content
          items={list.items}
          onItemSelect={this.handleItemSelectedChange}
          onItemRemove={this.handleItemRemove}
        />
        {selectedItems.length > 0 && <Footer items={selectedItems} />}
      </Fragment>
    )
  }

  private handleItemSelectedChange = (
    itemId: string,
    product: {},
    isSelected: boolean
  ) => {
    const { selectedItems } = this.state
    if (isSelected) {
      this.setState({
        selectedItems: append({ itemId, product }, selectedItems),
      })
    } else {
      this.setState({
        selectedItems: filter(({ itemId: id }) => id !== itemId, selectedItems),
      })
    }
  }

  private itemWithoutProduct = ({
    id,
    productId,
    skuId,
    quantity,
  }: ListItem): ListItem => ({ id, productId, skuId, quantity })

  private handleItemRemove = (itemId: string): void => {
    const { client, listId } = this.props
    const { list, selectedItems } = this.state

    const listUpdated = {
      ...list,
      items: filter(({ id }: ListItem) => id !== itemId, list.items || []),
    }
    const itemsUpdated = map(
      item => this.itemWithoutProduct(item),
      listUpdated.items
    )

    updateList(client, listId, { ...list, items: itemsUpdated }).then(() => {
      if (this.isComponentMounted) {
        this.setState({
          list: listUpdated,
          selectedItems: filter(
            ({ itemId: id }) => id !== itemId,
            selectedItems
          ),
        })
      }
    })
  }

  private handleFinishUpdate = (list: List): void => {
    this.setState({ list, showUpdateList: false })
  }

  private handleOnClose = (): void => {
    const { list } = this.state
    const { onClose } = this.props
    if (list) {
      const currentList: List = {
        ...list,
        items: map(item => this.itemWithoutProduct(item), list.items || []),
      }
      onClose([currentList])
    }
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
  injectIntl
)(ListDetail)
