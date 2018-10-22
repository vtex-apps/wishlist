import React, { Component, ReactNode } from 'react'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'

interface PopupProps {
  children: ReactNode,
  onOutsideClick: () => void,
  buttonOffsetWidth: number
}

/**
 * Pop-up component.
 */
export default class Popup extends Component<PopupProps> {
  public static propTypes = {
    /* The pop-up's content */
    children: PropTypes.object,
    /* Offset width to set the arrow position */
    buttonOffsetWidth: PropTypes.number,
    /* Function to be called when click occurs outside the popup */
    onOutsideClick: PropTypes.func,
  }

  public render(): ReactNode {
    const {
      children,
      onOutsideClick,
      buttonOffsetWidth,
    } = this.props

    const boxPositionStyle = {
      right: buttonOffsetWidth && buttonOffsetWidth - 49,
    }

    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div
          className="vtex-wishlist__box w-100 left-0 h-5 fixed bottom-0 z-9999"
        >
          <div className="shadow-3">
            <div className="mt3 flex flex-column">{children}</div>
          </div>
        </div>
      </OutsideClickHandler>
    )
  }
}