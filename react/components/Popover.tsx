import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import wishList from '../wishList.css'

interface PopoverProps {
  onOutsideClick: () => void
  children?: ReactNode
  left?: boolean
}

class Popover extends Component<PopoverProps, {}> {
  public render(): ReactNode {
    const { children, onOutsideClick, left } = this.props
    const className = classNames(`${wishList.popover} absolute z-max`, {
      [`${wishList.popoverLeft} left-0 ml4 shadow-3 tl`]: left,
      'right-0': !left,
    })
    return (
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div className={className}>
            {children}
        </div>
      </OutsideClickHandler>
    )
  }
}

export default Popover