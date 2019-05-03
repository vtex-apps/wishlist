import React, { Component, MouseEvent, ReactNode, TouchEvent } from 'react'
import { createPortal } from 'react-dom'

import styles from '../wishList.css'

const OPEN_BOTTOM_BAR_CLASS = styles.open

interface BottomBarProps {
  children: ReactNode
  onOutsideClick: (
    e: MouseEvent<HTMLElement> | TouchEvent<HTMLDivElement>
  ) => void
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
    const { children, onOutsideClick } = this.props

    return createPortal(
      <div
        role="presentation"
        className="fixed top-0 left-0 z-999 vh-100 vw-100 flex flex-column"
        onClick={e => e.stopPropagation()}
      >
        <div
          role="presentation"
          onClick={e => onOutsideClick(e)}
          className="h-100 w-100 bg-base--inverted z-4 o-40"
        />
        <div className="w-100">{children}</div>
      </div>,
      document.body
    )
  }
}

export default BottomBar
