import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import {
  ActionMenu,
  Checkbox,
  IconOptionsDots,
  IconVisibilityOff,
  IconVisibilityOn,
} from 'vtex.styleguide'
import DialogMessage from './Dialog/DialogMessage'

interface ListItemProps extends InjectedIntlProps {
  id: number
  list: List
  isDefault: boolean
  isSelected?: boolean
  showMenuOptions?: boolean
  hideAction?: boolean
  hideBorders?: boolean
  onClick?: (id: number) => void
  onSelected?: (id: number, isSelected?: boolean) => void
  onDeleted?: (listId: string) => Promise<void>
  onUpdated?: (index: number) => void
}

interface ListItemState {
  showDeleteDialog?: boolean
}

class ListItem extends Component<ListItemProps, {}> {
  public state: ListItemState = {}

  private options = [
    {
      onClick: () =>
        this.props.onUpdated && this.props.onUpdated(this.props.id),
      label: this.props.intl.formatMessage({
        id: 'wishlist-option-configuration',
      }),
    },
    {
      onClick: () => this.setState({ showDeleteDialog: true }),
      label: this.props.intl.formatMessage({ id: 'wishlist-option-delete' }),
    },
  ]

  private isComponentMounted: boolean = false

  public componentDidMount() {
    this.isComponentMounted = true
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public render(): ReactNode {
    const {
      id,
      list: { name, isPublic, id: listId },
      isSelected,
      isDefault,
      showMenuOptions,
      hideAction,
      hideBorders,
      intl,
      onClick,
      onDeleted,
      onSelected,
    } = this.props
    const { showDeleteDialog } = this.state
    const className = classNames('w-100 flex flex-row items-center ph4 pv3', {
      'bg-muted-5': isDefault,
      'bt b--muted-4': !hideBorders,
      'c-emphasis': hideBorders && isSelected,
      'c-muted-2': !isSelected || !hideBorders,
    })
    return (
      <div className={className}>
        <div
          className="w-100 flex pointer"
          role="presentation"
          onClick={() => onClick && onClick(id)}
        >
          <div className="flex items-center ml2">
            {isPublic ? <IconVisibilityOn /> : <IconVisibilityOff />}
          </div>
          <span className="w-100 mh4 mv1">{name}</span>
        </div>
        {!hideAction &&
          (showMenuOptions
            ? !isDefault && (
                <div role="presentation" onClick={e => e.stopPropagation()}>
                  <ActionMenu
                    options={this.options}
                    hideCaretIcon
                    buttonProps={{
                      variation: 'tertiary',
                      icon: <IconOptionsDots color="c-action-primary" />,
                      size: 'small',
                    }}
                  />
                </div>
              )
            : !isDefault && (
                <div className="flex items-center c-action-primary">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => onSelected && onSelected(id, isSelected)}
                  />
                </div>
              ))}
        {showDeleteDialog && (
          <DialogMessage
            message={intl.formatMessage(
              { id: 'wishlist-delete-confirmation-message' },
              { listName: name }
            )}
            onClose={() => this.setState({ showDeleteDialog: false })}
            onSuccess={() =>
              onDeleted &&
              onDeleted(listId || '')
                .then(
                  () =>
                    this.isComponentMounted &&
                    this.setState({ showDeleteDialog: false })
                )
                .catch(
                  () =>
                    this.isComponentMounted &&
                    this.setState({ showDeleteDialog: false })
                )
            }
          />
        )}
      </div>
    )
  }
}

export default injectIntl<ListItemProps>(ListItem)
