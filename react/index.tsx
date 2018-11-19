import React, { Component, MouseEvent, createRef, ReactNode } from 'react'
import { isMobile } from 'react-device-detect'

import BottomBar from './components/BottomBar'
import WishListContent from './components/WishListContent'

const MINIMUM_MAX_QUANTITY = 1
const MAXIMUM_MAX_QUANTITY = 10
const DEFAULT_MAX_QUANTITY = 1
const DEFAULT_LABEL_CLASSES = ''
const DEFAULT_ICON_CLASSES = 'gray'

export const WISHLIST_STORAKE_KEY = 'vtexwishlists'

interface WishListState {
  openContent: boolean
}

interface WishListProps {
  maxQuantity: number
  labelClasses: string
  iconClasses: string
  hideContent: boolean
}

/**
 * WishList component
 */
class WishList extends Component<WishListProps, WishListState> {
  // static propTypes = WishListPropTypes

  static defaultProps: WishListProps = {
    maxQuantity: DEFAULT_MAX_QUANTITY,
    labelClasses: DEFAULT_LABEL_CLASSES,
    iconClasses: DEFAULT_ICON_CLASSES,
    hideContent: false
  }

  public state: WishListState = {
    openContent: true
  }

  public iconRef = React.createRef<HTMLDivElement>()

  public handleClickButton = (event: MouseEvent<HTMLElement>): void => {
    if (!this.props.hideContent) {
      this.setState({
        openContent: !this.state.openContent
      })
    }
    event.persist()
  }

  public handleUpdateContentVisibility = (): void => {
    this.setState({
      openContent: true
    })
  }

  public render(): ReactNode {
    const { openContent } = this.state

    const large = isMobile || (window && window.innerWidth <= 480)

    return (
      openContent && (
        <div className="vtex-add-wishlist" ref={this.iconRef}>
          <BottomBar onOutsideClick={this.handleUpdateContentVisibility}>
            <WishListContent large={large} />
          </BottomBar>
        </div>
      )
    )
  }
}
export default WishList
