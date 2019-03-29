import { ApolloClient } from 'apollo-client'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { createList } from '../../GraphqlClient'
import Header from '../Header'
import ListForm from './ListForm'

import wishlist from '../../wishList.css'

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
  private isComponentMounted: boolean = false

  public componentDidMount() {
    this.isComponentMounted = true
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }


  public render() {
    const { onClose, intl } = this.props
    const { isLoading } = this.state
    return (
      <div className={`${wishlist.createList} vh-100 fixed top-0 left-0 w-100 bg-base z-4`}>
        <Header
          title={intl.formatMessage({ id: 'wishlist-new' })}
          onClose={onClose}
          showIconBack
        />
        <ListForm
          buttonLabel={intl.formatMessage({ id: 'wishlist-add-button' })}
          onSubmit={this.onSubmit}
          isLoading={isLoading}
        />
      </div>
    )
  }

  private onSubmit = (listData: List): void => {
    const { client } = this.props
    this.setState({ isLoading: true })
    if (client) {
      createList(client, { ...listData, items: [] })
        .then(response => {
          this.props.onFinishAdding(response.data.createList)
          if (this.isComponentMounted) {
            this.setState({ isLoading: false })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

  }

}

export default withApollo<CreateListProps, {}>(injectIntl(CreateList))
