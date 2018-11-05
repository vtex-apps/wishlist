import React, { Component, ReactNode, Fragment } from 'react'

import AddToList from './AddToList'
import AddList from './AddList'

interface WishListContentState {
  addingList: boolean
}

interface WishListContentProps {
  large: boolean
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

  render(): ReactNode {
    const { addingList } = this.state

    return (
      <Fragment>
        <div className="vtex-wishlist__overlay fixed w-100 h-100 top-0 left-0 right-0 bottom-0 bg-black-50 z-9999" />
        <div className="vtex-wishlist__box flex flex-column tc bg-white fixed w-100 left-0 bottom-0 z-max ">
          {addingList ? (
            <AddList onFinishAdding={this.switchAddList} />
          ) : (
            <AddToList onAddList={this.switchAddList} />
          )}
        </div>
      </Fragment>
    )
  }
}

export default WishListContent
