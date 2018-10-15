import React, { Component } from 'react'
import { isMobile } from 'react-device-detect'

import BottomBar from './components/BottomBar'
import WishListContent from './components/WishListContent'

const MINIMUM_MAX_QUANTITY = 1
const MAXIMUM_MAX_QUANTITY = 10
const DEFAULT_MAX_QUANTITY = 1
const DEFAULT_LABEL_CLASSES = ''
const DEFAULT_ICON_CLASSES = 'gray'

/**
 * WishList component
 */
export class WishList extends Component {
  // static propTypes = WishListPropTypes

  static defaultProps = {
    maxQuantity: DEFAULT_MAX_QUANTITY,
    labelClasses: DEFAULT_LABEL_CLASSES,
    iconClasses: DEFAULT_ICON_CLASSES,
  }

  state = {
    openContent: true,
  }

  handleClickButton = event => {
    if (!this.props.hideContent) {
      this.setState({
        openContent: !this.state.openContent,
      })
    }
    event.persist()
  }

  handleUpdateContentVisibility = () => {
    this.setState({
      openContent: true,
    })
  }

  handleItemAdd = () => {}

  render() {
    const { openContent } = this.state

    const large =
      isMobile ||
      (window && window.innerWidth <= 480)

    return openContent && (
      <div
        className="vtex-add-wishlist"
        ref={e => {
          this.iconRef = e
        }}
      >
        <BottomBar onOutsideClick={this.handleUpdateContentVisibility}>
          <WishListContent large={large} />
        </BottomBar>
      </div>
    )
  }
}
// {!hideContent &&
//   (large ? (
//     <Popup
//       onOutsideClick={this.handleUpdateContentVisibility}
//       isOpen={openContent}
//     >
//       <WishListContent large={large} />
//     </Popup>
//   ) : (
//     openContent && (
//       <BottomBar
//         onOutsideClick={this.handleUpdateContentVisibility}
//       >
//         <WishListContent large={large} />
//       </BottomBar>
//     )
//   ))}
export default WishList
