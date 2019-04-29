import React, { Component, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

import wishlist from '../wishList.css'

const OPEN_BOTTOM_BAR_CLASS = wishlist.open

interface BottomBarProps {
  children: ReactNode,
  onOutsideClick: (e: MouseEvent<HTMLElement>) => void
}

/**
 * Bottom bar component.
 */
class BottomBar extends Component<BottomBarProps> {
  public componentDidMount() {
    document.body.classList.add(OPEN_BOTTOM_BAR_CLASS)
  }

  public componentWillUnmount() {
    document.body.classList.remove(OPEN_BOTTOM_BAR_CLASS)
  }

  public render(): ReactNode {
    const {
      children,
      onOutsideClick,
    } = this.props

    return createPortal(
      <div
        className="fixed top-0 left-0 z-9999 vh-100 vw-100 flex flex-column"
        onMouseDown={(e: any) => e.stopPropagation()}
        onTouchStart={(e: any) => e.stopPropagation()}
      >
        <div
          onClick={onOutsideClick}
          className="h-100 w-100 bg-base--inverted z-4 o-40"
        />
        <div className="w-100">
          {children}
        </div>
      </ div>,
      document.body
    )
  }
}

export default BottomBar