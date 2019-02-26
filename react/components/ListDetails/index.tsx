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

import { getListDetailed } from '../../GraphqlClient'

interface ListDetailState {
  list?: any
  isLoading: boolean
  isAddingToCart?: boolean
  selectedItems: any
}

interface ListDetailProps {
  listId: string
  onClose: () => void
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
      onClick: () => console.log('configuration')
    },
    {
      title: translate('wishlist-option-delete', this.props.intl),
      onClick: () => console.log('delete')
    },
  ]

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
    const { isLoading } = this.state
    return (
      <div className="vh-100 flex flex-column">
        {isLoading ? renderLoading() : this.renderContent()}
      </div>
    )
  }
}

export default withApollo<ListDetailProps, {}>(orderFormConsumer(injectIntl(ListDetail)))
