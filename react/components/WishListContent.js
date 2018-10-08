import React, { Component, Fragment } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import classNames from 'classnames'

import AddToList from './AddToList'
import AddList from './AddList'

/**
 * Minicart content component
 */
class WishListContent extends Component {
  state = {
    addingList: false,
  }

  switchAddList = () => {
    console.log('Called')
    this.setState(({ addingList }) => ({ addingList: !addingList }))
  }

  render() {
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

export default injectIntl(WishListContent)
