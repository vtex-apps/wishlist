import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createList } from '../GraphqlClient'
import Header from './Header'
import { translate } from '../utils/translate'
import ListForm from './ListForm'

interface CreateListProps {
  onFinishAdding: (list: any) => void
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
class CreateList extends Component<CreateListProps, CreateListState> {
  public state: CreateListState = {}

  public onSubmit = (listData: List): void => {
    const { client } = this.props
    client && createList(client, { ...listData, items: [] })
      .then(response => {
        this.props.onFinishAdding(response.data.createList)
      })
      .catch(err => {
        console.error('something went wrong', err)
      })
  }

  public render() {
    const { onClose, intl } = this.props
    const { isLoading } = this.state
    return (
      <div className="vh-100">
        <Header title={translate("wishlist-new", intl)} onClose={onClose} />
        <ListForm
          buttonLabel={translate("wishlist-add-button", intl)}
          onSubmit={this.onSubmit}
          isLoading={isLoading}
        />
      </div>
    )
  }
}

export default withApollo(injectIntl(CreateList))
