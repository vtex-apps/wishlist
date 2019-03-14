import React, { Component, MouseEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'

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
      <div className="fixed top-0 left-0 z-9999 vh-100 vw-100 flex flex-column">
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