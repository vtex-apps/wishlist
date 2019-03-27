import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import { InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import {
  Checkbox,
  IconVisibilityOff,
  IconVisibilityOn
} from 'vtex.styleguide'
import Dialog from './Dialog'
import MenuOptions from './MenuOptions/MenuOptions'

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
  intl?: IntlShape
}

interface ListItemState {
  showDeleteDialog?: boolean
}

class ListItem extends Component<ListItemProps & InjectedIntlProps, {}> {
  public state: ListItemState = {}

  private options: Option[] = [
    {
      onClick: () => this.props.onUpdated(this.props.id),
      title: this.props.intl.formatMessage({ id: "wishlist-option-configuration" }),
    },
    {
      onClick: () => this.setState({ showDeleteDialog: true }),
      title: this.props.intl.formatMessage({ id: "wishlist-option-delete" }),
    },
  ]

  private __isMounted: boolean = false

  public componentDidMount() {
    this.__isMounted = true
  }

  public componentWillUnmount() {
    this.__isMounted = false
  }

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
      'bg-muted-5': isDefault,
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
            !isDefault && (
              <div className="flex items-center c-action-primary">
                <Checkbox
                  checked={isSelected}
                  onChange={() => onSelected && onSelected(id, isSelected)}
                />
              </div>
            )
          )}
        {showDeleteDialog && (
          <Dialog
            message={
              intl.formatMessage(
                { id: "wishlist-delete-confirmation-message" },
                { listName: name }
              )
            }
            onClose={() => this.__isMounted && this.setState({ showDeleteDialog: false })}
            onSuccess={() => onDeleted(listId)
              .then(() => this.__isMounted && this.setState({ showDeleteDialog: false }))
              .catch(() => this.__isMounted && this.setState({ showDeleteDialog: false }))
            }
          />
        )}
      </div>
    )
  }
}

export default injectIntl(ListItem)