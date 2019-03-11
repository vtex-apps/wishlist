import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { withApollo } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { updateList } from '../../GraphqlClient'
import Header from '../Header'
import { translate } from '../../utils/translate'
import ListForm from './ListForm'
import { map } from 'ramda'
import { withToast } from 'vtex.styleguide'

interface UpdateListProps {
  list: List
  onFinishUpdate: (list: any) => void
  onClose: () => void
  showToast?: ({ }) => void
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

  private itemsToItemsInput = (items: any): [Items] => map(
    ({ id, productId, skuId, quantity }) => ({ id, productId, skuId, quantity }),
    items)

  public onSubmit = ({ name, isPublic }: List): void => {
    const { client, list: { id, items }, list, showToast, intl } = this.props
    this.setState({ isLoading: true })
    client && updateList(
      client,
      id,
      {
        ...list,
        name,
        isPublic,
        items: this.itemsToItemsInput(items)
      }
    )
      .then(response => {
        this.setState({ isLoading: false })
        showToast && showToast({ message: translate('wishlist-list-updated', intl) })
        setTimeout(
          () => this.props.onFinishUpdate({ ...response.data.updateList, items }),
          500
        )
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

export default withToast(withApollo<UpdateListProps, {}>(injectIntl(UpdateList)))
