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

const ICON_SIZE = 20

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
    const className = classNames('w-100 flex flex-row items-center pv3', {
      'bg-action-secondary': isDefault,
      'bt b--muted-4': !hideBorders,
      'c-emphasis': hideBorders && isSelected,
      'c-muted-2': !isSelected || !hideBorders,
      pl4: showMenuOptions,
      ph4: !showMenuOptions,
    })
    const nameClassName = classNames('w-100 mh4 mv1', {
      'flex justify-center pv2': isDefault,
    })
    return (
      <div className={className}>
        <div
          tabIndex={0}
          role="button"
          className="w-100 flex pointer"
          onClick={() => onClick && onClick(id)}
          onKeyPress={this.handleKeyPress}
        >
          {!isDefault && (
            <div className="flex items-center ml2">
              {isPublic ? <IconVisibilityOn /> : <IconVisibilityOff />}
            </div>
          )}
          <span className={nameClassName}>{name}</span>
        </div>
        {!hideAction &&
          (showMenuOptions
            ? !isDefault && (
                <ActionMenu
                  options={this.options}
                  hideCaretIcon
                  buttonProps={{
                    variation: 'tertiary',
                    icon: <IconOptionsDots size={ICON_SIZE} />,
                    size: 'small',
                  }}
                />
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

  private handleKeyPress = (e: React.KeyboardEvent<{}>) => {
    const { onClick, id } = this.props
    if (e.key == 'Enter') {
      onClick && onClick(id)
    }
  }
}

export default injectIntl<ListItemProps>(ListItem)
