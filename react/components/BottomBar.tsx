import React, { Component, ReactNode, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'

interface PopupProps {
  children: ReactNode,
  onOutsideClick: (e: MouseEvent<HTMLElement>) => void
}

/**
 * Pop-up component.
 */
export default class Popup extends Component<PopupProps> {
  public static propTypes = {
    /* The pop-up's content */
    children: PropTypes.object,
    /* Function to be called when click occurs outside the popup */
    onOutsideClick: PropTypes.func,
  }

  public render(): ReactNode {
    const {
      children,
      onOutsideClick,
    } = this.props

    return createPortal(
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        {children}
      </OutsideClickHandler >,
      document.body
    )
  }
}