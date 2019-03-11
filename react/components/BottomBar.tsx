import React, { Component, ReactNode, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import OutsideClickHandler from 'react-outside-click-handler'

interface BottomBarProps {
  children: ReactNode,
  onOutsideClick: (e: MouseEvent<HTMLElement>) => void
}

/**
 * Bottom bar component.
 */
export default class BottomBar extends Component<BottomBarProps> {
  public render(): ReactNode {
    const {
      children,
      onOutsideClick,
    } = this.props

    return createPortal(
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div className="w-100 fixed bottom-0">
          {children}
        </div>
      </OutsideClickHandler >,
      document.body
    )
  }
}