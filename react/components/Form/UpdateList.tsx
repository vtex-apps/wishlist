import { ApolloClient } from 'apollo-client'
import { map } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withToast } from 'vtex.styleguide'
import { updateList } from '../../GraphqlClient'
import { translate } from '../../utils/translate'
import Header from '../Header'
import ListForm from './ListForm'

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
class UpdateList extends Component<UpdateListProps & InjectedIntlProps & WithApolloClient<{}>, UpdateListState> {
  public state: UpdateListState = {}
  private __isMounted: boolean = false

  public componentDidMount() {
    this.__isMounted = true
  }

  public componentWillUnmount() {
    this.__isMounted = false
  }


  public render() {
    const { onClose, intl, list } = this.props
    const { isLoading } = this.state
    return (
      <div className="vh-100">
        <Header
          title={translate('wishlist-option-configuration', intl)}
          onClose={onClose}
          showIconBack
        />
        <ListForm
          list={list}
          buttonLabel={translate('wishlist-save', intl)}
          onSubmit={this.onSubmit}
          isLoading={isLoading}
        />
      </div>
    )
  }

  private itemsToItemsInput = (items: any): [Items] => map(
    ({ id, productId, skuId, quantity }) => ({ id, productId, skuId, quantity }),
    items)

  private onSubmit = ({ name, isPublic }: List): void => {
    const { client, list: { id, items }, list, showToast, intl } = this.props
    this.__isMounted && this.setState({ isLoading: true })
    if (client) {
      updateList(
        client,
        id,
        {
          ...list,
          isPublic,
          items: this.itemsToItemsInput(items),
          name,
        }
      )
        .then(response => {
          this.__isMounted && this.setState({ isLoading: false })
          if (showToast) {
            showToast({ message: translate('wishlist-list-updated', intl) })
          }
          setTimeout(
            () => this.props.onFinishUpdate({ ...response.data.updateList, items }),
            500
          )
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

}

export default withToast(withApollo<UpdateListProps, {}>(injectIntl(UpdateList)))
