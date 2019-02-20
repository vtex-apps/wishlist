import React, { Component, ReactNode } from "react"
import Popover from './Popover'
import { map } from 'ramda'

interface MenuOptionsContentProps {
  options: Option[]
  onClose: () => void
}

class MenuOptionsContent extends Component<MenuOptionsContentProps, {}> {
  public render(): ReactNode {
    const { onClose, options } = this.props
    return (
      <Popover onOutsideClick={onClose}>
        <div className="bg-base shadow-3">
          {map(item => (
            <div
              key={item.title}
              className="w-100 bb b--muted-4 pv4 ph8 c-muted-1 flex justify-center pointer"
              onClick={item.onClick}
            >
              {item.title}
            </div>
          ), options)}
        </div>
      </Popover>
    )
  }
}

export default MenuOptionsContent