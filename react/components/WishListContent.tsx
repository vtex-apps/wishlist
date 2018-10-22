import React, { Component, ReactNode } from 'react'

import AddToList from './AddToList'
import AddList from './AddList'

interface WishListContentState {
  addingList: boolean
}

interface WishListContentProps {}

/**
 * 
 * Minicart content component
 */
class WishListContent extends Component<WishListContentProps, WishListContentState> {
  public state = {
    addingList: false,
  }

  public switchAddList = (): void => {
    this.setState(({ addingList }) => ({ addingList: !addingList }))
  }

  render(): ReactNode {
    const { addingList } = this.state

    return (
      <div className="flex flex-column tc bg-white f6">
        {addingList ? (
          <AddList onFinishAdding={this.switchAddList} />
        ) : (
          <AddToList onAddList={this.switchAddList} />
        )}
      </div>
    )
  }
}

export default WishListContent
