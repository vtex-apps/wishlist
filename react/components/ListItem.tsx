import React, { Component, ReactNode } from "react"
import {
  IconCheck,
  IconVisibilityOff,
  IconVisibilityOn
} from "vtex.styleguide"
import classNames from 'classnames'
import MenuOptions from './MenuOptions'
import { translate } from '../utils/translate'
import { injectIntl, intlShape } from 'react-intl'

interface ListItemProps {
  id: number
  list: List
  isDefault: boolean
  isSelected?: boolean
  onClick?: (id: number, isSelected?: boolean) => void
  showMenuOptions?: boolean,
  onDeleted: (index: number) => void
  intl?: intlShape
}

class ListItem extends Component<ListItemProps, {}> {
  private options: Option[] = [
    {
      title: translate('wishlist-option-delete', this.props.intl),
      onClick: () => this.props.onDeleted(this.props.id)
    }
  ]

  public render(): ReactNode {
    const {
      id,
      list: { name, isPublic },
      isSelected,
      isDefault,
      onClick,
      showMenuOptions
    } = this.props
    const className = classNames('w-100 bt b--muted-4 flex flex-row pv3 ph4 c-muted-3', {
      'bg-muted-5': isDefault
    })
    return (
      <div
        className={className}
        onClick={() => onClick && onClick(id, isSelected)}
      >
        <div className="flex items-center ml2">{isPublic ?
          <IconVisibilityOn />
          :
          <IconVisibilityOff />
        }
        </div>
        <span className="w-100 mh4 mv1 c-muted-1">{name}</span>
        {showMenuOptions ? (
          <MenuOptions options={this.options} />
        ) : (
            <div className="flex items-center c-action-primary">
              {isSelected && <IconCheck />}
            </div>
          )}
      </div>
    )
  }
}

export default injectIntl(ListItem)