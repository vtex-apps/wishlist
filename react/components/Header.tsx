import React, { Component, ReactNode } from "react"
import { IconClose, IconPlusLines } from 'vtex.styleguide'

interface HeaderProps {
  title: string
  onClose: () => void
  action?: () => void
  children: ReactNode
}

class Header extends Component<HeaderProps, {}> {
  public render(): ReactNode {
    const { title, onClose, action, children } = this.props
    return (
      <div className="flex flex-row pa4 items-center bb bt b--muted-4">
        <div className="flex items-center pointer" onClick={onClose}>
          <IconClose size={23} />
        </div>
        <span className="t-heading-6 w-100 mh5 flex justify-center">
          {title}
        </span>
        {children}
        {action && (
          <div
            className="flex items-center pointer"
            onClick={action}
          >
            <IconPlusLines size={20} />
          </div>
        )}
      </div>
    )
  }
}

export default Header