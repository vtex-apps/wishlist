import React, { Component, ReactNode, Fragment } from 'react'

import AddToList from './AddToList'
import CreateList from './CreateList'
import { WISHLIST_STORAKE_KEY } from '../'

interface WishListContentState {
  addingList: boolean
  showMenuAdd?: boolean
}

interface WishListContentProps {
  large: boolean
  skuId?: string
  showMenu?: boolean
  productId?: string
  onSuccess: () => void
  onClose: () => void
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
    addingList: false,
    showMenuAdd: false,
  }

  public switchAddList = (): void => {
    this.setState(({ addingList }) => ({ addingList: !addingList }))
  }

  public onFinishingAddingList = (id?: string): void => {
    if (id) {
      this.saveListToLocalStorage(id)
    }
    this.switchAddList()
  }

  public saveListToLocalStorage = (id: string): void => {
    const lists = localStorage.getItem(WISHLIST_STORAKE_KEY)
    let newLists = lists ? lists + ',' + id : id
    localStorage.setItem(WISHLIST_STORAKE_KEY, newLists)
  }

  public render(): ReactNode {
    const { addingList, showMenuAdd } = this.state
    const { skuId, productId, onSuccess, onClose, showMenu } = this.props

    return (
      <Fragment>
        {(showMenu || showMenuAdd) &&
          <div className="vtex-wishlist__overlay fixed w-100 h-100 top-0 left-0 right-0 bottom-0 bg-black-50 z-9999" onClick={onClose} />
        }
        <div className="vtex-wishlist__box flex flex-column tc bg-white fixed w-100 left-0 bottom-0 z-max ">
          {addingList ? (
            <CreateList onFinishAdding={this.onFinishingAddingList} />
          ) : (
              <AddToList
                showMenu={showMenu || showMenuAdd}
                onShowMenu={() => this.setState({ showMenuAdd: true })}
                onAddList={this.switchAddList}
                onSuccess={onSuccess}
                onClose={onClose}
                skuId={skuId}
                productId={productId}
                onFinishAdding={this.saveListToLocalStorage}
              />
            )}
        </div>
      </Fragment>
    )
  }
}

export default WishListContent
