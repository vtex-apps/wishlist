import React, { ReactNode } from 'react'

import { isMobile } from 'react-device-detect'
import { IconCaretLeft, IconClose, IconPlusLines } from 'vtex.styleguide'
import classNames from 'classnames'

interface HeaderProps {
  title?: string
  onClose: () => void
  action?: () => void
  showIconBack?: boolean
  children?: ReactNode
}

const ICON_SIZE = 20
const CLOSE_ICON_SIZE = 23

const handleKeyPress = (e: React.KeyboardEvent<{}>, onClick: () => void) => {
  if (e.key == 'Enter') {
    onClick()
  }
}

const Header = (props: HeaderProps): JSX.Element => {
  const { title, onClose, action, children, showIconBack } = props
  const className = classNames('flex items-center pointer', {
    ml3: children,
  })
  const containerStyle = classNames(
    'flex flex-row pa4 items-center bb bt b--muted-4',
    {
      pl6: children,
      ph6: !children,
    }
  )
  return (
    <div className={containerStyle}>
      <div
        className={className}
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyPress={e => handleKeyPress(e, onClose)}
      >
        {showIconBack && isMobile ? (
          <IconCaretLeft size={ICON_SIZE} />
        ) : (
          <IconClose size={CLOSE_ICON_SIZE} />
        )}
      </div>
      <span className="t-heading-6 w-100 mh5 pv3 flex justify-center">
        {title}
      </span>
      {children}
      {action && (
        <div
          className="flex items-center pointer"
          role="button"
          tabIndex={0}
          onClick={action}
          onKeyPress={e => handleKeyPress(e, action)}
        >
          <IconPlusLines size={ICON_SIZE} />
        </div>
      )}
    </div>
  )
}

export default Header
