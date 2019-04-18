import React, { Component, ReactNode } from 'react'
import { FormattedMessage, InjectedIntlProps, injectIntl, IntlShape } from 'react-intl'
import { IconPlusLines } from 'vtex.styleguide'

import CreateList from '../Form/CreateList'
import UpdateList from '../Form/UpdateList'
import MenuOptions from '../MenuOptions/MenuOptions'

interface HeaderState {
  showcreateList?: boolean
  showUpdateList?: boolean
}

interface HeaderProps {
  list?: List
  intl?: IntlShape
  onListCreated: (list: List) => void
  onListUpdated: (list: List) => void
}

const ICONS_SIZE = 20

class Header extends Component<HeaderProps & InjectedIntlProps, HeaderState> {
  public state: HeaderState = {}
  private options: Option[] = [
    {
      onClick: () => this.setState({ showUpdateList: true }),
      title: this.props.intl.formatMessage({ id: 'wishlist-option-configuration' }),
    },
    {
      onClick: () => this.setState({}),
      title: this.props.intl.formatMessage({ id: 'wishlist-option-delete' }),
    },
  ]

  public render(): ReactNode {
    const { showcreateList, showUpdateList } = this.state
    const { list } = this.props

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
}

export default injectIntl(Header)