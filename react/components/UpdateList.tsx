import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { updateList } from '../GraphqlClient'
import Header from './Header'
import { translate } from '../utils/translate'
import ListForm from './ListForm'

interface UpdateListProps {
  list: List
  onFinishUpdate: (list: any) => void
  onClose: () => void
  intl?: any
  client?: ApolloClient<any>
}

interface UpdateListState {
  isLoading?: boolean
}

/**
 * Wishlist element to add product to a list
 */
class UpdateList extends Component<UpdateListProps, UpdateListState> {
  public state: UpdateListState = {}

  public onSubmit = ({ name, isPublic }: List): void => {
    const { client, list: { id }, list } = this.props
    this.setState({ isLoading: true })
    client && updateList(client, id, { ...list, name, isPublic })
      .then(response => {
        this.props.onFinishUpdate(response.data.updateList)
        this.setState({ isLoading: false })
      })
      .catch(err => {
        console.error('something went wrong', err)
      })
  }

  public render() {
    const { onClose, intl, list } = this.props
    const { isLoading } = this.state
    return (
      <div className="vh-100">
        <Header title={translate("wishlist-option-configuration", intl)} onClose={onClose} />
        <ListForm
          list={list}
          buttonLabel={translate("wishlist-save", intl)}
          onSubmit={this.onSubmit}
          isLoading={isLoading}
        />
      </div>
    )
  }
}

export default withApollo<UpdateListProps, {}>(injectIntl(UpdateList))
