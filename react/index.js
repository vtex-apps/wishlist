import React, { Component } from 'react'
import { Button } from 'vtex.styleguide'
import { isMobile } from 'react-device-detect'

import Sidebar from './components/Sidebar'
import Popup from './components/Popup'
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
    console.log('this.state.openContent => ', this.state.openContent)
    if (!this.props.hideContent) {
      this.setState({
        openContent: !this.state.openContent,
      })
    }
    event.persist()
  }

  handleUpdateContentVisibility = () => {
    this.setState({
      openContent: false,
    })
  }

  handleItemAdd = () => {}

  render() {
    const { openContent } = this.state
    const {
      type,
      hideContent,
    } = this.props

    const quantity = 0

    const large =
      (type && type === 'sidebar') ||
      isMobile ||
      (window && window.innerWidth <= 480)

    return (
      <div
        className="vtex-WishList relative fr"
        ref={e => {
          this.iconRef = e
        }}
      >
        <Button
          variation="tertiary"
          icon
          onClick={event => this.handleClickButton(event)}
        >
          <div className="flex items-center">
            <span className={`vtex-WishList__label dn-m db-l f6 pl6`}>
              WishList
            </span>
          </div>
        </Button>
        {!hideContent &&
          (large ? (
            <Sidebar
              onOutsideClick={this.handleUpdateContentVisibility}
              isOpen={openContent}
            >
              <WishListContent large={large} />
            </Sidebar>
          ) : (
            openContent && (
              <Popup
                onOutsideClick={this.handleUpdateContentVisibility}
              >
                <WishListContent large={large} />
              </Popup>
            )
          ))}
      </div>
    )
  }
}

export default WishList
