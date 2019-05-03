import React, { Component, ReactNode } from 'react'
import { createPortal } from 'react-dom'

import styles from '../wishList.css'

const OPEN_BOTTOM_BAR_CLASS = styles.open

interface BottomBarProps {
  children: ReactNode
  onOutsideClick: () => void
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
      <div className="fixed top-0 left-0 z-999 vh-100 vw-100 flex flex-column">
        <div
          tabIndex={0}
          role="button"
          onClick={() => onOutsideClick()}
          onKeyPress={this.handleKeyPress}
          className="h-100 w-100 bg-base--inverted z-4 o-40"
        />
        <div className="w-100">{children}</div>
      </div>,
      document.body
    )
  }

  private handleKeyPress = (e: React.KeyboardEvent<{}>) => {
    if (e.key == 'Enter') {
      this.props.onOutsideClick()
    }
  }
}

export default BottomBar
