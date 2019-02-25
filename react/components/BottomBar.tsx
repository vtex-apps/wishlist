import React, { Component, ReactNode, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import OutsideClickHandler from 'react-outside-click-handler'

interface PopupProps {
  children: ReactNode,
  onOutsideClick: (e: MouseEvent<HTMLElement>) => void
}

/**
 * Pop-up component.
 */
export default class Popup extends Component<PopupProps> {
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