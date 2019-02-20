import React, { Component, ReactNode } from "react"
import {
  IconCheck,
  IconVisibilityOff,
  IconVisibilityOn
} from "vtex.styleguide"
import classNames from 'classnames'

interface ListItemProps {
  id: number
  list: List
  isDefault: boolean
  isSelected?: boolean
  onSelectedClick: (id: number) => void
  onUnselectedClick: (id: number) => void
}

class ListItem extends Component<ListItemProps, {}> {
  public render(): ReactNode {
    const {
      id,
      list: { name, isPublic },
      isSelected,
      isDefault,
      onSelectedClick,
      onUnselectedClick
    } = this.props
    const className = classNames('w-100 bt b--muted-4 flex flex-row pv3 ph4 c-muted-3', {
      'bg-muted-5': isDefault
    })
    return (
      <div
        className={className}
        onClick={() => !isDefault && isSelected ? onSelectedClick(id) : onUnselectedClick(id)}
      >
        <div className="flex items-center ml2">{isPublic ?
          <IconVisibilityOn />
          :
          <IconVisibilityOff />
        }
        </div>
        <span className="w-100 mh4 mv1 c-muted-1">{name}</span>
        <div className="flex items-center c-action-primary">
          {isSelected && <IconCheck />}
        </div>
      </div>
    )
  }
}

export default ListItem