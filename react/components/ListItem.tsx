import React, { Component, ReactNode } from "react"
import {
  IconVisibilityOff,
  IconVisibilityOn,
  Checkbox
} from "vtex.styleguide"
import classNames from 'classnames'
import MenuOptions from './MenuOptions/MenuOptions'
import { translate } from '../utils/translate'
import { injectIntl, intlShape } from 'react-intl'
import Dialog from './Dialog'

interface ListItemProps {
  id: number
  list: List
  isDefault: boolean
  isSelected?: boolean
  showMenuOptions?: boolean,
  onClick?: (id: number) => void
  onSelected?: (id: number, isSelected?: boolean) => void
  onDeleted: (listId: string) => Promise<any>
  onUpdated: (index: number) => void
  intl?: intlShape
}

interface ListItemState {
  showDeleteDialog?: boolean
}

class ListItem extends Component<ListItemProps, {}> {
  public state: ListItemState = {}

  private options: Option[] = [
    {
      title: translate('wishlist-option-configuration', this.props.intl),
      onClick: () => this.props.onUpdated(this.props.id)
    },
    {
      title: translate('wishlist-option-delete', this.props.intl),
      onClick: () => this.setState({ showDeleteDialog: true })
    },
  ]

  public render(): ReactNode {
    const {
      id,
      list: { name, isPublic, id: listId },
      isSelected,
      isDefault,
      showMenuOptions,
      intl,
      onClick,
      onDeleted,
      onSelected,
    } = this.props
    const { showDeleteDialog } = this.state
    const className = classNames('w-100 bt b--muted-4 flex flex-row pv3 ph4 c-muted-3', {
      'bg-muted-5': isDefault
    })
    return (
      <div className={className}>
        <div
          className="w-100 flex"
          onClick={() => onClick && onClick(id)}
        >
          <div className="flex items-center ml2">{isPublic ?
            <IconVisibilityOn />
            :
            <IconVisibilityOff />
          }
          </div>
          <span className="w-100 mh4 mv1 c-muted-1">{name}</span>
        </div>
        {showMenuOptions ? (
          <MenuOptions options={this.options} />
        ) : (
            <div className="flex items-center c-action-primary">
              <Checkbox
              checked={isSelected}
              onChange={() => onSelected && onSelected(id, isSelected)}
              />
            </div>
          )}
        {showDeleteDialog && (
          <Dialog
            message={`${translate("wishlist-delete-confirmation-message", intl)} "${name}"?`}
            onClose={() => this.setState({ showDeleteDialog: false })}
            onSuccess={() => onDeleted(listId)
              .then(() => this.setState({ showDeleteDialog: false }))
              .catch(() => this.setState({ showDeleteDialog: false }))
            }
          />
        )}
      </div>
    )
  }
}

export default injectIntl(ListItem)