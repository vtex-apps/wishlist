import React, { Component, Fragment, ReactNode } from 'react'

import classNames from 'classnames'
import { append, filter, map, tail } from 'ramda'
import { Spinner } from 'vtex.styleguide'

import ApolloClient from 'apollo-client'
import { withApollo, WithApolloClient } from 'react-apollo'
import { getListDetailed, updateList } from '../../GraphqlClient'
import ListItems from '../ListDetails/Content'
import Footer from '../ListDetails/Footer'
import Header from './Header'

import wishlist from '../../wishList.css'

interface ContentProps {
  listId: string
  lists?: any
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
    isLoading: true,
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
    if (this.props.listId !== prevProps.listId) {
      this.fetchListDetails()
    }
  }

  public render(): ReactNode {
    const { list, selectedItems, isLoading } = this.state
    const { listId, lists } = this.props
    const className = classNames('ba b--muted-4 mt6 relative overflow-auto w-100 h-100', {
      'pb10': selectedItems && selectedItems.length > 0,
    })
    const listsAsOptions = filter((e: any) => e.id !== listId, tail(lists))

    return (
      <div className="h-100 flex flex-column">
        {isLoading ? (
          <div className="flex justify-center w-100">
            <Spinner />
          </div>
        ) : (
            <Fragment>
              <Header
                list={{ ...list, id: listId }}
                onListCreated={this.props.onListCreated}
                onListUpdated={this.props.onListUpdated}
                onListDeleted={this.props.onListDeleted}
              />
              <div className={className}>
                <div className={`${wishlist.listPageItemsContainer} overflow-auto w-100`}>
                  <div className="w-100">
                    <ListItems
                      lists={listsAsOptions}
                      hideItemsQuantityLabel
                      items={list ? list.items : []}
                      onItemSelect={this.onItemSelect}
                      onItemRemove={this.onItemRemove}
                    />
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <div className="absolute bottom-0 left-0 w-100">
                    <div className="bg-base">
                      <Footer
                        items={selectedItems}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Fragment>
          )
        }
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
    this.setState({ isLoading: true, list: null })
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