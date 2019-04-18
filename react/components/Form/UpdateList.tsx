import { ApolloClient } from 'apollo-client'
import { map } from 'ramda'
import React, { Component } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withToast } from 'vtex.styleguide'
import { updateList } from '../../GraphqlClient'
import Header from '../Header'
import ListForm from './ListForm'

import wishlist from '../../wishList.css'
import FormView from './FormView'

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
  private isComponentMounted: boolean = false

  public componentDidMount() {
    this.isComponentMounted = true
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }


  public render() {
    const { onClose, intl, list } = this.props
    const { isLoading } = this.state
    return (
      <FormView onClose={onClose}>
        <div className={`${wishlist.updateList}`}>
          <Header
            title={intl.formatMessage({ id: 'wishlist-option-configuration' })}
            onClose={onClose}
            showIconBack
          />
          <ListForm
            list={list}
            buttonLabel={intl.formatMessage({ id: 'wishlist-save' })}
            onSubmit={this.onSubmit}
            isLoading={isLoading}
          />
        </div>
      </FormView>
    )
  }

  private itemsToItemsInput = (items: any): [any] => map(
    ({ id, productId, skuId, quantity }) => ({ id, productId, skuId, quantity }),
    items)

  private onSubmit = ({ name, isPublic }: List): void => {
    const { client, list: { id, items }, list, showToast, intl } = this.props
    this.setState({ isLoading: true })
    const bla = {
      isPublic,
      items: this.itemsToItemsInput(items),
      name,
    }
    if (client) {
      updateList(
        client,
        id || '',
        {
          isPublic,
          items: this.itemsToItemsInput(items),
          name,
        }
      )
        .then((response: any) => {
          if (this.isComponentMounted) {
            this.setState({ isLoading: false })
          }
          if (showToast) {
            showToast({ message: intl.formatMessage({ id: 'wishlist-list-updated' }) })
          }
          this.props.onFinishUpdate({ ...response.data.updateList, items })
        })
        .catch((err: any) => {
          console.error(err)
        })
    }
  }

}

export default withToast(withApollo<UpdateListProps, {}>(injectIntl(UpdateList)))
