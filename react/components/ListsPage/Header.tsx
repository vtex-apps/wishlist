import React, { Component, ReactNode } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl'
import {
  ActionMenu,
  ButtonWithIcon,
  IconOptionsDots,
  IconPlusLines,
} from 'vtex.styleguide'

import { compose, withApollo, WithApolloClient } from 'react-apollo'

import DialogMessage from '../Dialog/DialogMessage'
import CreateList from '../Form/CreateList'
import UpdateList from '../Form/UpdateList'

import { deleteList } from '../../GraphqlClient'

interface HeaderState {
  showcreateList?: boolean
  showUpdateList?: boolean
  showDeleteConfirmation?: boolean
}

interface HeaderProps extends InjectedIntlProps, WithApolloClient<{}> {
  isDefault?: boolean
  list?: List
  onListCreated: (list: List) => void
  onListUpdated: (list: List) => void
  onListDeleted: () => void
}

const ICONS_SIZE = 20

class Header extends Component<HeaderProps, HeaderState> {
  public state: HeaderState = {}
  private options = [
    {
      onClick: () => this.setState({ showUpdateList: true }),
      label: this.props.intl.formatMessage({
        id: 'wishlist-option-configuration',
      }),
    },
    {
      onClick: () => this.setState({ showDeleteConfirmation: true }),
      label: this.props.intl.formatMessage({ id: 'wishlist-option-delete' }),
    },
  ]

  public render(): ReactNode {
    const {
      showcreateList,
      showUpdateList,
      showDeleteConfirmation,
    } = this.state
    const { list, intl } = this.props
    const plusIcon = <IconPlusLines size={ICONS_SIZE} />

    return list ? (
      <div className="w-100 ph6 flex items-center">
        <div className="w-100 t-heading-2">{list.name}</div>
        <div className="flex flex-row items-center w-100 justify-end">
          <div className="ttu mh2">
            <span>
              <FormattedMessage
                id="wishlist-quantity-products"
                values={{ productsQuantity: list.items && list.items.length }}
              />
            </span>
          </div>
          <ButtonWithIcon
            variation="tertiary"
            icon={plusIcon}
            onClick={this.handleCreateList}
          />
          {list.isEditable && (
            <div className="ml5">
              <ActionMenu
                hideCaretIcon
                options={this.options}
                buttonProps={{
                  variation: 'tertiary',
                  icon: <IconOptionsDots size={ICONS_SIZE} />,
                }}
              />
            </div>
          )}
        </div>
        {showcreateList && (
          <CreateList
            onClose={() => this.setState({ showcreateList: false })}
            onFinishAdding={this.handleListCreated}
          />
        )}
        {showUpdateList && (
          <UpdateList
            list={list}
            onClose={() => this.setState({ showUpdateList: false })}
            onFinishUpdate={this.handleListUpdated}
          />
        )}
        {showDeleteConfirmation && (
          <DialogMessage
            message={intl.formatMessage(
              { id: 'wishlist-delete-confirmation-message' },
              { listName: list.name }
            )}
            onClose={() => this.setState({ showDeleteConfirmation: false })}
            onSuccess={this.handleDeleteList}
          />
        )}
      </div>
    ) : null
  }

  private handleCreateList = () => {
    this.setState({ showcreateList: true })
  }

  private handleListCreated = (list: List): void => {
    const { onListCreated } = this.props
    this.setState({ showcreateList: false })
    onListCreated(list)
  }

  private handleListUpdated = (list: List) => {
    this.setState({ showUpdateList: false })
    this.props.onListUpdated(list)
  }

  private handleDeleteList = (): void => {
    const { client, list } = this.props
    if (list && list.id) {
      deleteList(client, list.id).then(() => {
        this.setState({ showDeleteConfirmation: false })
        this.props.onListDeleted()
      })
    }
  }
}

export default compose(
  withApollo,
  injectIntl
)(Header)
