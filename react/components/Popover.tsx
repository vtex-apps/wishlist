import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'

import styles from '../wishList.css'

interface PopoverProps {
  onOutsideClick: () => void
  children: JSX.Element
  left?: boolean
  iconSize: number | null
}

const EMPTY_STRING = ""
const PIXEL = "px"

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
    
    setContentVerticalPosition(contentBound.top)
    setContentHorizontalPosition(contentBound.right)
  }

  const getContentBounds = (): ClientRect | null =>
    contentElement.current &&
    contentElement.current.getBoundingClientRect &&
    contentElement.current.getBoundingClientRect()

  const setContentVerticalPosition = (contentTop: number): void => {
    const contentChild = getContentChild()
    const maxHeightContent: string | null = getMaxHeightContent(contentChild)

    if(!maxHeightContent) return
    
    const maxHeightContentLength: number = Number(maxHeightContent.replace(PIXEL, EMPTY_STRING))
    const windowHeight = window.innerHeight
    const isOutOfBottomBound = maxHeightContentLength + contentTop > windowHeight
    if(isOutOfBottomBound) {
      const iconSize = props.iconSize ? props.iconSize : 0
      const newTopContent = -(maxHeightContentLength + iconSize)
      setContentTop(newTopContent)
    }
  }

  const getContentChild = (): HTMLElement | null =>
    contentElement.current &&
    (contentElement.current.children.item(0) as HTMLElement)

  const getMaxHeightContent = (content: HTMLElement | null): string | null =>
    content && window.getComputedStyle(content).maxHeight

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
