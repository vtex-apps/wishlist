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

const OPEN_UPDATE_LIST_CLASS = wishlist.open

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
    document.body.classList.add(OPEN_UPDATE_LIST_CLASS)
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
    document.body.classList.remove(OPEN_UPDATE_LIST_CLASS)
  }


  public render() {
    const { onClose, intl, list } = this.props
    const { isLoading } = this.state
    return (
      <div className={`${wishlist.updateList} vh-100`}>
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
    )
  }

  private itemsToItemsInput = (items: any): [Items] => map(
    ({ id, productId, skuId, quantity }) => ({ id, productId, skuId, quantity }),
    items)

  private onSubmit = ({ name, isPublic }: List): void => {
    const { client, list: { id, items }, list, showToast, intl } = this.props
    this.setState({ isLoading: true })
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
        .then((response: any) => {
          if (this.isComponentMounted) {
            this.setState({ isLoading: false })
          }
          if (showToast) {
            showToast({ message: intl.formatMessage({ id: 'wishlist-list-updated' }) })
          }
          setTimeout(
            () => this.props.onFinishUpdate({ ...response.data.updateList, items }),
            500
          )
        })
        .catch((err: any) => {
          console.error(err)
        })
    }
  }

}

export default withToast(withApollo<UpdateListProps, {}>(injectIntl(UpdateList)))
