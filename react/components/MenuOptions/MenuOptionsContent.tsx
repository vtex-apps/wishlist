import React, { Component, ReactNode } from 'react'

import classNames from 'classnames'
import { map } from 'ramda'

import Popover from '../Popover'

interface MenuOptionsContentProps {
  options: Option[]
  onClose: () => void
}

class MenuOptionsContent extends Component<MenuOptionsContentProps, {}> {
  public render(): ReactNode {
    const { onClose, options } = this.props
    return (
      <Popover onOutsideClick={onClose}>
        <div className="bg-base shadow-3" onClick={onClose}>
          {map(item => {
            console.log(item)
            return (
              <div
                key={item.title}
                className={classNames('w-100 bb b--muted-4 pv4 ph8 c-muted-1 flex justify-center pointer', {
                  'bg-disabled': item.disabled,
                })}
                onClick={() => !item.disabled && item.onClick}
              >
                {item.title}
              </div>
            )
          }, options)}
        </div>
      </Popover>
    )
  }
}

export default MenuOptionsContent