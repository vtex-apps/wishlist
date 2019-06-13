import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import styles from '../wishList.css'

interface PopoverProps {
  onOutsideClick: () => void
  children: JSX.Element
  left?: boolean
  buttonHeight: number | null
}

const Popover = (props: PopoverProps): JSX.Element => {
  const contentElement = React.createRef<HTMLDivElement>()

  const [contentTop, setContentTop] = useState()
  const [isLeft, setIsLeft] = useState(props.left)

  useEffect(() => {
    updateContentPosition()
  })
  
  const updateContentPosition = () => {
    const contentBound: ClientRect | null = getContentBounds()

    if(!contentBound) return
    
    const {
      top,
      height,
      right
    } = contentBound

    setContentVerticalPosition(top, height)
    setContentHorizontalPosition(right)
  }

  const getContentBounds = (): ClientRect | null =>
    contentElement.current &&
    contentElement.current.getBoundingClientRect &&
    contentElement.current.getBoundingClientRect()

  const setContentVerticalPosition = (contentTop: number, contentHeight: number): void => {
    const windowHeight = window.innerHeight
    const isOutOfBottomBound = contentHeight + contentTop > windowHeight

    if(isOutOfBottomBound) {
      const buttonHeight = props.buttonHeight ? props.buttonHeight : 0
      const newTopContent = -(contentHeight + buttonHeight)
      setContentTop(newTopContent)
    }
  }

  const setContentHorizontalPosition = (rightPosition: number): void => {
    const {
      clientWidth
    } = document.documentElement
    
    const isOutOfRightBound = rightPosition > clientWidth
    if(props.left && isOutOfRightBound) {
      setIsLeft(false)
    }
  }

  const { children, onOutsideClick } = props
  const className = classNames(styles.popover, 'absolute z-max', {
    [`${styles.popoverLeft} left-0 shadow-3 tl`]: isLeft,
    [`${styles.popoverRight} right-0 shadow-3 tr`]: !isLeft,
  })
  return (
    <div className="relative">
      <OutsideClickHandler onOutsideClick={onOutsideClick}>
        <div ref={contentElement}
            className={className}
            style={{top: contentTop }}>
          {children}
        </div>
      </OutsideClickHandler>
    </div>
  )
}

export default Popover
