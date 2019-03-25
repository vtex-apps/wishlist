import { ApolloClient } from 'apollo-client'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { createList } from '../../GraphqlClient'
import { translate } from '../../utils/translate'
import Header from '../Header'
import ListForm from './ListForm'

interface CreateListProps {
  onFinishAdding: (list: List) => void
  onClose: () => void
  intl?: any
  client?: ApolloClient<any>
}

interface CreateListState {
  isLoading?: boolean
}

/**
 * Wishlist element to add product to a list
 */
class CreateList extends Component<CreateListProps & InjectedIntlProps & WithApolloClient<{}>, CreateListState> {
  public state: CreateListState = {}
  private __isMounted: boolean = false

  public componentDidMount() {
    this.__isMounted = true
  }

  public componentWillUnmount() {
    this.__isMounted = false
  }


  public render() {
    const { onClose, intl } = this.props
    const { isLoading } = this.state
    return (
      <div className="vh-100 fixed top-0 left-0 w-100 bg-base z-4">
        <Header
          title={translate('wishlist-new', intl)}
          onClose={onClose}
          showIconBack
        />
        <ListForm
          buttonLabel={translate('wishlist-add-button', intl)}
          onSubmit={this.onSubmit}
          isLoading={isLoading}
        />
      </div>
    )
  }

  private onSubmit = (listData: List): void => {
    const { client } = this.props
    this.__isMounted && this.setState({ isLoading: true })
    if (client) {
      createList(client, { ...listData, items: [] })
      .then(response => {
        this.props.onFinishAdding(response.data.createList)
        this.__isMounted && this.setState({ isLoading: false })
      })
      .catch(err => {
        console.error(err)
      })
    }

  }

}

export default withApollo<CreateListProps, {}>(injectIntl(CreateList))
