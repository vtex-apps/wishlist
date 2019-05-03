import React, { ReactNode } from 'react'

import { isMobile } from 'react-device-detect'
import { IconCaretLeft, IconClose, IconPlusLines } from 'vtex.styleguide'

interface HeaderProps {
  title?: string
  onClose: () => void
  action?: () => void
  showIconBack?: boolean
  children?: ReactNode
}

const ICON_SIZE = 20
const CLOSE_ICON_SIZE = 23

const Header = (props: HeaderProps): JSX.Element => {
  const { title, onClose, action, children, showIconBack } = props
  return (
    <div className="flex flex-row pa4 items-center bb bt b--muted-4">
      <div
        className="flex items-center pointer"
        role="presentation"
        onClick={onClose}
      >
        {showIconBack && isMobile ? (
          <IconCaretLeft size={ICON_SIZE} />
        ) : (
          <IconClose size={CLOSE_ICON_SIZE} />
        )}
      </div>
      <span className="t-heading-6 w-100 mh5 flex justify-center">{title}</span>
      {children}
      {action && (
        <div
          className="flex items-center pointer"
          role="presentation"
          onTouchStart={action}
          onMouseDown={action}
        >
          <IconPlusLines size={ICON_SIZE} />
        </div>
      )}
    </div>
  )
}

export default Header
