import React, { Component, ReactNode } from 'react'

import classNames from 'classnames'
import { append, filter, map } from 'ramda'

import ApolloClient from 'apollo-client'
import { withApollo, WithApolloClient } from 'react-apollo'
import { getListDetailed, updateList } from '../../GraphqlClient'
import ListItems from '../ListDetails/Content'
import Footer from '../ListDetails/Footer'
import Header from './Header'

import wishlist from '../../wishList.css'

interface ContentProps {
  listId: string
  onListCreated: (list: List) => void
  onListUpdated: (list: List) => void
  onListDeleted: () => void
  client?: ApolloClient<any>
}

interface ContentState {
  list?: any
  selectedItems: any
  isLoading?: boolean
}

class Content extends Component<ContentProps & WithApolloClient<any>, ContentState> {
  public state: ContentState = {
    selectedItems: [],
  }
  private isComponentMounted = false

  public componentWillUnmount(): void {
    this.isComponentMounted = false
  }

  public componentDidMount(): void {
    this.isComponentMounted = true
    this.fetchListDetails()
  }

  public componentDidUpdate(prevProps: any): void {
    if (this.props !== prevProps) {
      this.fetchListDetails()
    }
  }

  public render(): ReactNode {
    const { list, selectedItems } = this.state
    const { listId } = this.props
    const className = classNames('overflow-auto', {
      [wishlist.listPageItemsContainer]: !selectedItems || selectedItems.length === 0,
      [wishlist.listPageItemsContainer2]: selectedItems && selectedItems.length > 0,
    })

    return (
      <div className="h-100 flex flex-column">
        <Header
          list={{ ...list, id: listId }}
          onListCreated={this.props.onListCreated}
          onListUpdated={this.props.onListUpdated}
          onListDeleted={this.props.onListDeleted}
        />
        <div className="ba b--muted-4 mt6 h-100 relative">
          <div className={className}>
            <ListItems
              hideItemsQuantityLabel
              items={list ? list.items : []}
              onItemSelect={this.onItemSelect}
              onItemRemove={this.onItemRemove}
            />
          </div>
          {selectedItems.length > 0 && (
            <div className="absolute bottom-0 left-0 w-100">
              <div className="bg-base">
                <Footer items={selectedItems} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  private onItemSelect = (itemId: string, product: any, isSelected: boolean): void => {
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
    const { list, selectedItems } = this.state
    const listUpdated = { ...list, items: filter(({ id }) => id !== itemId, list ? list.items : []) }
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

  private fetchListDetails(): void {
    const { client, listId } = this.props
    if (client) {
      getListDetailed(client, listId)
        .then(response => {
          if (this.isComponentMounted) {
            this.setState({ list: response.data.list, isLoading: false })
          }
        })
    }
  }
}

export default withApollo(Content)