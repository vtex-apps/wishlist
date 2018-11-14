import React, { Component, ReactNode, Fragment } from 'react'

import AddToList from './AddToList'
import AddList from './AddList'
import { WISHLIST_STORAKE_KEY } from '../'

interface WishListContentState {
  addingList: boolean
}

interface WishListContentProps {
  large: boolean
  skuId?: string
  productId?: string
  onSuccess: () => void
}

/**
 *
 * Minicart content component
 */
class WishListContent extends Component<
  WishListContentProps,
  WishListContentState
> {
  public state = {
    addingList: false
  }

  public switchAddList = (): void => {
    this.setState(({ addingList }) => ({ addingList: !addingList }))
  }

  public onFinishingAddingList = (id?: string): void => {
    this.switchAddList()
    if (!id) return
    const lists = localStorage.getItem(WISHLIST_STORAKE_KEY)
    let newLists = lists ? lists + ',' + id : id
    localStorage.setItem(WISHLIST_STORAKE_KEY, newLists)
  }
  
  render(): ReactNode {
    const { addingList } = this.state
    const { skuId, productId, onSuccess } = this.props

    return (
      <Fragment>
        <div className="vtex-wishlist__overlay fixed w-100 h-100 top-0 left-0 right-0 bottom-0 bg-black-50 z-9999" />
        <div className="vtex-wishlist__box flex flex-column tc bg-white fixed w-100 left-0 bottom-0 z-max ">
          {addingList ? (
            <AddList onFinishAdding={this.onFinishingAddingList} />
          ) : (
            <AddToList
              onAddList={onSuccess}
              skuId={skuId}
              productId={productId}
            />
          )}
        </div>
      </Fragment>
    )
  }
}

export default WishListContent
