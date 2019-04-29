import classNames from 'classnames'
import React from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import styles from '../wishList.css'

interface PopoverProps {
  onOutsideClick: () => void
  children: JSX.Element
  left?: boolean
}

const Popover = (props: PopoverProps): JSX.Element => {
  const { children, onOutsideClick, left } = props
  const className = classNames(styles.popover, 'absolute z-max', {
    [`${styles.popoverLeft} left-0 ml4 shadow-3 tl`]: left,
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

export default Popover