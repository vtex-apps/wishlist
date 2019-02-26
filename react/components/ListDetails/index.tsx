import React, { Component, ReactNode, Fragment } from 'react'
// import { ExtensionPoint } from 'vtex.render-runtime'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { injectIntl, intlShape } from 'react-intl'
import { map, path } from 'ramda'
import { orderFormConsumer } from 'vtex.store-resources/OrderFormContext'
import Header from '../Header'
import renderLoading from '../Loading'
import MenuOptions from '../MenuOptions'
import { translate } from '../../utils/translate'
import Footer from './Footer'
import Content from './Content'
import Dialog from '../Dialog'
import UpdateList from '../UpdateList'

import { getListDetailed } from '../../GraphqlClient'

interface ListDetailState {
  list?: List
  isLoading: boolean
  isAddingToCart?: boolean
  selectedItems: any
  showDeleteConfirmation?: boolean
  showUpdateList?: boolean
}

interface ListDetailProps {
  listId: string
  onClose: () => void
  onDeleted: (id: string) => Promise<any>
  client?: ApolloClient<any>
  orderFormContext?: any
  intl?: intlShape
}

class ListDetail extends Component<ListDetailProps, ListDetailState> {
  state: ListDetailState = {
    isLoading: true,
    selectedItems: []
  }

  private options: Option[] = [
    {
      title: translate('wishlist-option-configuration', this.props.intl),
      onClick: () => this.setState({ showUpdateList: true })
    },
    {
      title: translate('wishlist-option-delete', this.props.intl),
      onClick: () => this.setState({ showDeleteConfirmation: true })
    },
  ]

  private onFinishUpdate = (list: List): void => {
    console.log('new List', list)
    this.setState({ list: list, showUpdateList: false })
  }

  public componentDidMount(): void {
    const { listId, client } = this.props
    client && getListDetailed(client, listId)
      .then(response => {
        this.setState({ list: response.data.list, isLoading: false })
      })
      .catch(err => console.error('Something went wrong', err))
  }

  private renderContent = (): ReactNode => {
    const { list: { name, items }, selectedItems } = this.state
    const { onClose } = this.props
    return (
      <Fragment>
        <Header title={name} onClose={onClose}>
          <MenuOptions options={this.options} />
        </Header>
        <Content items={items} />
        <Footer items={selectedItems} />
      </Fragment>
    )
  }

  public render(): ReactNode {
    const { list, isLoading, showDeleteConfirmation, showUpdateList } = this.state
    const { intl, onDeleted, listId } = this.props
    return (
      <div className="vh-100 flex flex-column">
        {isLoading ? renderLoading() : this.renderContent()}
        {showDeleteConfirmation && (
          <Dialog
            message={`${translate("wishlist-delete-confirmation-message", intl)} "${list.name}"?`}
            onClose={() => this.setState({ showDeleteConfirmation: false })}
            onSuccess={() => onDeleted(listId)}
          />
        )}
        {showUpdateList && (
          <div className="fixed top-0 left-0 w-100 bg-base">
            <UpdateList
              onClose={() => this.setState({ showUpdateList: false })}
              list={{ ...list, id: listId }}
              onFinishUpdate={this.onFinishUpdate}
            />
          </div>
        )}
      </div>
    )
  }
}

export default withApollo<ListDetailProps, {}>(orderFormConsumer(injectIntl(ListDetail)))
