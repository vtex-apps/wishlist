import React, { Component, ReactNode } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { IconPlusLines } from 'vtex.styleguide'

import ApolloClient from 'apollo-client'
import { withApollo, WithApolloClient } from 'react-apollo'

import DialogMessage from '../Dialog/DialogMessage'
import CreateList from '../Form/CreateList'
import UpdateList from '../Form/UpdateList'
import MenuOptions from '../MenuOptions/MenuOptions'

import { deleteList } from '../../GraphqlClient'

interface HeaderState {
  showcreateList?: boolean
  showUpdateList?: boolean
  showDeleteConfirmation?: boolean
}

interface HeaderProps {
  list?: List
  intl?: IntlShape
  onListCreated: (list: List) => void
  onListUpdated: (list: List) => void
  onListDeleted: () => void
  client?: ApolloClient<any>
}

const ICONS_SIZE = 20

class Header extends Component<HeaderProps & InjectedIntlProps & WithApolloClient<any>, HeaderState> {
  public state: HeaderState = {}
  private options: Option[] = [
    {
      onClick: () => this.setState({ showUpdateList: true }),
      title: this.props.intl.formatMessage({ id: 'wishlist-option-configuration' }),
    },
    {
      onClick: () => this.setState({ showDeleteConfirmation: true }),
      title: this.props.intl.formatMessage({ id: 'wishlist-option-delete' }),
    },
  ]

  public render(): ReactNode {
    const { showcreateList, showUpdateList, showDeleteConfirmation } = this.state
    const { list, intl } = this.props

    return list ? (
      <div className="w-100 ph8 flex items-center">
        <div className="w-100 t-heading-2">
          {list.name}
        </div>
        <div className="flex flex-row items-center w-100 justify-end">
          <div className="ttu mh2">
            <span>
              <FormattedMessage
                id="wishlist-quantity-products"
                values={{ productsQuantity: list.items && list.items.length }}
              />
            </span>
          </div>
          <div
            className="pointer c-on-base mh5"
            onClick={() => this.setState({ showcreateList: true })}
          >
            <IconPlusLines size={ICONS_SIZE} />
          </div>
          <MenuOptions
            options={this.options}
            size={ICONS_SIZE}
          />
        </div>
        {showcreateList && (
          <CreateList
            onClose={() => this.setState({ showcreateList: false })}
            onFinishAdding={this.onListCreated}
          />
        )}
        {showUpdateList && (
          <UpdateList
          list={list}
          onClose={() => this.setState({ showUpdateList: false })}
          onFinishUpdate={this.onListUpdated}
          />
        )}
        {showDeleteConfirmation && (
          <DialogMessage
          message={
            intl.formatMessage(
              { id: 'wishlist-delete-confirmation-message' },
              { listName: list.name }
            )
          }
          onClose={() => this.setState({ showDeleteConfirmation: false })}
          onSuccess={this.handleDeleteList}
        />
        )}
      </div>
    ) : null
  }

  private onListCreated = (list: any): void => {
    const { onListCreated } = this.props
    this.setState({ showcreateList: false })
    onListCreated(list)
  }

  private onListUpdated = (list: any) => {
    this.setState({ showUpdateList: false })
    this.props.onListUpdated(list)
  }

  private handleDeleteList = (): void => {
    const { client, list } = this.props
    if (client) {
      deleteList(client, list.id)
      .then(() => {
        this.setState({ showDeleteConfirmation: false })
        this.props.onListDeleted()
      })
    }
  }
}

export default injectIntl(withApollo(Header))