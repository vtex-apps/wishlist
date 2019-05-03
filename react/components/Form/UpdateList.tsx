import { map } from 'ramda'
import React, { Component } from 'react'
import { compose, withApollo, WithApolloClient } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withToast } from 'vtex.styleguide'
import { updateList } from '../../GraphqlClient'
import Header from '../Header'
import FormView from './FormView'
import ListForm from './ListForm'

import styles from '../../wishList.css'

interface UpdateListProps extends InjectedIntlProps, WithApolloClient<{}> {
  list: List
  onFinishUpdate: (list: List) => void
  onClose: () => void
  showToast?: (input: ToastInput) => void
}

interface UpdateListState {
  isLoading?: boolean
}

class UpdateList extends Component<UpdateListProps, UpdateListState> {
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
        <div className={`${styles.updateList}`}>
          <Header
            title={intl.formatMessage({ id: 'wishlist-option-configuration' })}
            onClose={onClose}
            showIconBack
          />
          <ListForm
            list={list}
            buttonLabel={intl.formatMessage({ id: 'wishlist-save' })}
            onSubmit={this.handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </FormView>
    )
  }

  private itemsToItemsInput = (items: ListItem[] | undefined): ListItem[] =>
    items
      ? map(
          ({ id, productId, skuId, quantity }) => ({
            id,
            productId,
            skuId,
            quantity,
          }),
          items
        )
      : []

  private handleSubmit = ({ name, isPublic }: List): void => {
    const {
      client,
      list: { id, items },
      showToast,
      intl,
    } = this.props
    this.setState({ isLoading: true })
    updateList(client, id || '', {
      isPublic,
      items: this.itemsToItemsInput(items),
      name,
    })
      .then((response: ResponseList) => {
        if (this.isComponentMounted) {
          this.setState({ isLoading: false })
        }
        if (showToast) {
          showToast({
            message: intl.formatMessage({ id: 'wishlist-list-updated' }),
          })
        }
        this.props.onFinishUpdate({ ...response.data.updateList, items })
      })
      .catch((err: {}) => {
        console.error(err)
      })
  }
}

export default compose(
  withToast,
  withApollo,
  injectIntl
)(UpdateList)
