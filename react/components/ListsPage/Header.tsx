import React, { Component, ReactNode } from 'react'
import {
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
  defineMessages,
} from 'react-intl'
import { ActionMenu, IconOptionsDots } from 'vtex.styleguide'

import {
  compose,
  withApollo,
  WithApolloClient,
  ChildDataProps,
} from 'react-apollo'

import DialogMessage from '../Dialog/DialogMessage'
import UpdateList from '../Form/UpdateList'

import { deleteList } from '../../GraphqlClient'
import withSettings from '../../withSettings'

interface HeaderState {
  showcreateList?: boolean
  showUpdateList?: boolean
  showDeleteConfirmation?: boolean
}

interface HeaderProps
  extends InjectedIntlProps,
    WithApolloClient<{}>,
    ChildDataProps<{}, { appSettings: Settings }> {
  isDefault?: boolean
  list: List
  onListUpdated: (list: List) => void
  onListDeleted: () => void
}

const ICONS_SIZE = 20
const messages = defineMessages({
  optionConfiguration: {
    defaultMessage: '',
    id: 'store/wishlist-option-configuration',
  },
  optionDelete: {
    defaultMessage: '',
    id: 'store/wishlist-option-delete',
  },
  messageDeleteConfirmation: {
    defaultMessage: '',
    id: 'store/wishlist-delete-confirmation-message',
  },
  productsQuantity: {
    defaultMessage: '',
    id: 'store/wishlist-quantity-products',
  },
  defaultListName: {
    id: 'store/wishlist-default-list-name',
    defaultMessage: '',
  },
})

class Header extends Component<HeaderProps, HeaderState> {
  public state: HeaderState = {}
  private options = [
    {
      onClick: () => this.setState({ showUpdateList: true }),
      label: this.props.intl.formatMessage(messages.optionConfiguration),
    },
    {
      onClick: () => this.setState({ showDeleteConfirmation: true }),
      label: this.props.intl.formatMessage(messages.optionDelete),
    },
  ]

  public render(): ReactNode {
    const { showUpdateList, showDeleteConfirmation } = this.state
    const {
      list,
      list: { name, isEditable, items },
      data: { appSettings },
      intl: { formatMessage },
    } = this.props
    const title = !isEditable
      ? (appSettings && appSettings.defaultListName) ||
        formatMessage(messages.defaultListName)
      : name

    return (
      <div className="w-100 flex items-center">
        <div className="w-100 t-heading-2">{title}</div>
        <div className="flex flex-row items-center w-100 justify-end">
          <div className="ttu mh2">
            <FormattedMessage
              {...messages.productsQuantity}
              values={{ productsQuantity: items && items.length }}
            />
          </div>
          {isEditable && (
            <div className="ml3">
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
        {showUpdateList && (
          <UpdateList
            list={list}
            onClose={() => this.setState({ showUpdateList: false })}
            onFinishUpdate={this.handleListUpdated}
          />
        )}
        {showDeleteConfirmation && (
          <DialogMessage
            message={formatMessage(messages.messageDeleteConfirmation, {
              listName: name,
            })}
            onClose={() => this.setState({ showDeleteConfirmation: false })}
            onSuccess={this.handleDeleteList}
          />
        )}
      </div>
    )
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
  injectIntl,
  withSettings
)(Header)
